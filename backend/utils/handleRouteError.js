// Sends a JSON error response from route catch blocks.
// Bad input -> 400 with a clear message.
// Server crash -> 500 with a generic message.
export function handleRouteError(res, error, serverMessage = "Something went wrong") {
  if (error.name === "ValidationError") {
    const message = Object.values(error.errors)
      .map((item) => item.message)
      .join(", ");

    return res.status(400).json({ message });
  }

  if (error.name === "CastError") {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  if (error.message) {
    return res.status(400).json({ message: error.message });
  }

  console.error(serverMessage, error);
  return res.status(500).json({ message: serverMessage });
}
