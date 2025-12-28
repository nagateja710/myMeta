async function loadLibrary() {
  try {
    const data = await apiFetch("/user-media/");
    console.log("FETCHED FROM API:", data); // 👈 ADD THIS
    setItems(data);
  } catch (err) {
    console.error("Failed to load library", err);
  } finally {
    setLoading(false);
  }
}
