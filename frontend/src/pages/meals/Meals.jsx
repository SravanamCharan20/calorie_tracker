/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../utils/AuthContext.jsx";
import {
  createMeal,
  deleteMeal,
  getMeals,
  updateMeal,
} from "../../services/mealService.js";
import {
  getEndOfLocalDay,
  getStartOfLocalDay,
  parseLocalDateInput,
} from "../../utils/dateUtils.js";
import DashboardLayout from "../../components/dashboard/DashboardLayout.jsx";
import Header from "../../components/dashboard/Header.jsx";
import MealFilters from "../../components/meals/MealFilters.jsx";
import MealsTable from "../../components/meals/MealsTable.jsx";
import MealFormModal from "../../components/meals/MealFormModal.jsx";
import BulkImportModal from "../../components/meals/BulkImportModal.jsx";

const MEALS_PAGE_SIZE = 5;

const Meals = () => {
  const { isAuthenticated } = useAuth();

  const [meals, setMeals] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [activeFilter, setActiveFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalMeal, setModalMeal] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalSaveError, setModalSaveError] = useState("");
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  useEffect(() => {
    // Wait 300ms after typing before searching so we don't hit the API on every keystroke.
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [search]);

  const fetchMeals = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      if (startDate && endDate && startDate > endDate) {
        setError("Start date must be on or before end date.");
        setMeals([]);
        setTotalPages(1);
        setTotal(0);
        return;
      }

      const params = {
        page,
        limit: MEALS_PAGE_SIZE,
        search: debouncedSearch,
      };

      if (activeFilter) {
        params.mealType = activeFilter;
      }

      if (startDate) {
        // Convert the date picker value to local day boundaries before sending ISO strings to the API.
        params.startDate = getStartOfLocalDay(
          parseLocalDateInput(startDate),
        ).toISOString();
      }

      if (endDate) {
        params.endDate = getEndOfLocalDay(
          parseLocalDateInput(endDate),
        ).toISOString();
      }

      const response = await getMeals(params);
      const safeTotalPages = Math.max(1, response.totalPages ?? 1);
      const currentPage = Math.min(page, safeTotalPages);

      setMeals(response.meals ?? []);
      setTotalPages(safeTotalPages);
      setTotal(response.total ?? 0);

      // If filters removed pages (e.g. user was on page 3 but only 1 page left), step back.
      if (currentPage !== page) {
        setPage(currentPage);
      }
    } catch (fetchError) {
      console.log("Meals error:", fetchError);
      setError(fetchError.message);
    } finally {
      setLoading(false);
    }
  }, [page, activeFilter, startDate, endDate, debouncedSearch]);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchMeals();
  }, [isAuthenticated, fetchMeals]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]); // New search should always start from page 1.

  const handleSearchChange = (value) => {
    setSearch(value);
  };

  const handleFilterChange = (value) => {
    setActiveFilter(value);
    setPage(1);
  };

  const handleStartDateChange = (value) => {
    setStartDate(value);
    setPage(1);
  };

  const handleEndDateChange = (value) => {
    setEndDate(value);
    setPage(1);
  };

  const handleClearDates = () => {
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  const pageSize = MEALS_PAGE_SIZE;
  const rangeStart = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, total);

  const visiblePages = Array.from({ length: totalPages }, (_, index) => index + 1)
    .filter((pageNumber) => {
      if (totalPages <= 5) return true;
      if (pageNumber === 1 || pageNumber === totalPages) return true;
      return Math.abs(pageNumber - page) <= 1;
    });

  const handleAddMeal = () => {
    setModalMeal(null);
    setModalSaveError("");
    setShowModal(true);
  };

  const handleEditMeal = (meal) => {
    setModalMeal(meal);
    setModalSaveError("");
    setShowModal(true);
  };

  const handleDeleteMeal = async (meal) => {
    if (!window.confirm(`Delete "${meal.foodName}"?`)) return;

    try {
      await deleteMeal(meal._id);
      fetchMeals();
    } catch (deleteError) {
      console.log("Delete error:", deleteError);
      setError(deleteError.message);
    }
  };

  const handleSaveMeal = async (mealData) => {
    try {
      setIsSaving(true);
      setModalSaveError("");

      if (modalMeal) {
        await updateMeal(modalMeal._id, mealData);
      } else {
        await createMeal(mealData);
      }

      setShowModal(false);
      setModalMeal(null);
      setModalSaveError("");
      fetchMeals();
    } catch (saveError) {
      console.log("Save error:", saveError);
      setModalSaveError(saveError.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <Header title="Meals" showAddMeal={false} />

      <section className="mb-6">
        <p className="text-sm text-muted">Your food diary</p>
        <div className="mt-1 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
            Meals & nutrition
          </h2>
          <div className="flex flex-wrap gap-2 self-start">
            <button
              type="button"
              onClick={() => setShowBulkImport(true)}
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-card-elevated"
            >
              Bulk upload
            </button>
            <button
              type="button"
              onClick={handleAddMeal}
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-card-elevated"
            >
              + Add meal
            </button>
          </div>
        </div>
      </section>

      <div className="mb-6">
        <MealFilters
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
          search={search}
          onSearchChange={handleSearchChange}
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={handleStartDateChange}
          onEndDateChange={handleEndDateChange}
          onClearDates={handleClearDates}
        />
      </div>

      {error && (
        <p
          role="alert"
          className="mb-4 rounded-2xl border border-error/30 bg-error/10 px-4 py-3 text-sm text-error"
        >
          {error}
        </p>
      )}

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-16 animate-pulse rounded-2xl bg-card-elevated"
            />
          ))}
        </div>
      ) : (
        <MealsTable
          meals={meals}
          onEdit={handleEditMeal}
          onDelete={handleDeleteMeal}
        />
      )}

      {!loading && !error && (
        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted">
            Showing {rangeStart}-{rangeEnd} of {total} meals
            {(startDate || endDate || activeFilter || debouncedSearch) &&
              " matching filters"}
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((currentPage) => currentPage - 1)}
              className="rounded-full border border-border px-4 py-2 text-sm font-medium text-muted transition-colors hover:text-white disabled:opacity-40"
            >
              Previous
            </button>
            {visiblePages.map((pageNumber, index) => {
              const previousPageNumber = visiblePages[index - 1];
              const showEllipsis =
                index > 0 && pageNumber - previousPageNumber > 1;

              return (
                <span key={pageNumber} className="flex items-center gap-2">
                  {showEllipsis && (
                    <span className="px-1 text-sm text-muted">...</span>
                  )}
                  <button
                    type="button"
                    onClick={() => setPage(pageNumber)}
                    aria-current={pageNumber === page ? "page" : undefined}
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                      pageNumber === page
                        ? "bg-white text-black"
                        : "border border-border text-muted hover:text-white"
                    }`}
                  >
                    {pageNumber}
                  </button>
                </span>
              );
            })}
            <button
              type="button"
              disabled={page >= totalPages || total === 0}
              onClick={() => setPage((currentPage) => currentPage + 1)}
              className="rounded-full border border-border px-4 py-2 text-sm font-medium text-muted transition-colors hover:text-white disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {showBulkImport && (
        <BulkImportModal
          onClose={() => setShowBulkImport(false)}
          onImported={() => {
            fetchMeals();
          }}
          isImporting={isImporting}
          setIsImporting={setIsImporting}
        />
      )}

      {showModal && (
        <MealFormModal
          key={modalMeal?._id ?? "new"}
          meal={modalMeal}
          onClose={() => {
            setShowModal(false);
            setModalMeal(null);
            setModalSaveError("");
          }}
          onSave={handleSaveMeal}
          isSaving={isSaving}
          saveError={modalSaveError}
        />
      )}
    </DashboardLayout>
  );
};

export default Meals;
