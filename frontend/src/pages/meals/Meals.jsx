/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "../../utils/AuthContext.jsx";
import {
  createMeal,
  deleteMeal,
  getMeals,
  updateMeal,
} from "../../services/mealService.js";
import DashboardLayout from "../../components/dashboard/DashboardLayout.jsx";
import Header from "../../components/dashboard/Header.jsx";
import MealFilters from "../../components/meals/MealFilters.jsx";
import MealsTable from "../../components/meals/MealsTable.jsx";
import MealFormModal from "../../components/meals/MealFormModal.jsx";

const Meals = () => {
  const { isAuthenticated } = useAuth();

  const [meals, setMeals] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [activeFilter, setActiveFilter] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalMeal, setModalMeal] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchMeals = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = { page, limit: 10 };

      if (activeFilter) {
        params.mealType = activeFilter;
      }

      const response = await getMeals(params);

      setMeals(response.meals);
      setTotalPages(response.totalPages);
      setTotal(response.total);
    } catch (fetchError) {
      console.log("Meals error:", fetchError);
      setError(fetchError.message);
    } finally {
      setLoading(false);
    }
  }, [page, activeFilter]);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchMeals();
  }, [isAuthenticated, fetchMeals]);

  const filteredMeals = useMemo(() => {
    if (!search.trim()) return meals;

    const query = search.trim().toLowerCase();
    return meals.filter((meal) =>
      meal.foodName.toLowerCase().includes(query),
    );
  }, [meals, search]);

  const handleFilterChange = (value) => {
    setActiveFilter(value);
    setPage(1);
  };

  const handleAddMeal = () => {
    setModalMeal(null);
    setShowModal(true);
  };

  const handleEditMeal = (meal) => {
    setModalMeal(meal);
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

      if (modalMeal) {
        await updateMeal(modalMeal._id, mealData);
      } else {
        await createMeal(mealData);
      }

      setShowModal(false);
      setModalMeal(null);
      fetchMeals();
    } catch (saveError) {
      console.log("Save error:", saveError);
      setError(saveError.message);
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
          <button
            type="button"
            onClick={handleAddMeal}
            className="inline-flex items-center gap-1.5 self-start rounded-full border border-border px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-card-elevated"
          >
            + Add meal
          </button>
        </div>
      </section>

      <div className="mb-6">
        <MealFilters
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
          search={search}
          onSearchChange={setSearch}
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
          meals={filteredMeals}
          onEdit={handleEditMeal}
          onDelete={handleDeleteMeal}
        />
      )}

      {!loading && (
        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted">
            Showing {filteredMeals.length} of {total} meals
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-full border border-border px-4 py-2 text-sm font-medium text-muted transition-colors hover:text-white disabled:opacity-40"
            >
              Previous
            </button>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-sm font-semibold text-black">
              {page}
            </span>
            {totalPages > page && (
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-sm text-muted">
                {page + 1}
              </span>
            )}
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-full border border-border px-4 py-2 text-sm font-medium text-muted transition-colors hover:text-white disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {showModal && (
        <MealFormModal
          key={modalMeal?._id ?? "new"}
          meal={modalMeal}
          onClose={() => {
            setShowModal(false);
            setModalMeal(null);
          }}
          onSave={handleSaveMeal}
          isSaving={isSaving}
        />
      )}
    </DashboardLayout>
  );
};

export default Meals;
