async function performSearchAndCompare(searchQuery) {
  try {
    // First API call to /ai
    const searchResponse = await fetch(
      `http://localhost:3000/api/ai?query=${encodeURIComponent(searchQuery)}`
    );
    if (!searchResponse.ok) {
      throw new Error("Search request failed");
    }
    const searchData = await searchResponse.json();

    // Prepare the data for /process endpoint
    const processData = {
      text: "Your placeholder text here",
      compareText: JSON.stringify(searchData),
    };

    // Second API call to /process
    const processResponse = await fetch("http://localhost:3000/api/process", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(processData),
    });

    if (!processResponse.ok) {
      throw new Error("Process request failed");
    }

    const processResult = await processResponse.json();
    return processResult;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

performSearchAndCompare("news about the ukraine-russia conflict")
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
