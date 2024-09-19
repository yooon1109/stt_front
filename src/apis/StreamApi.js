import axios from "axios";

export const stopStreaming = async () => {
  try {
    await fetch("/api/stop", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("API call was successful.");
  } catch (error) {
    console.error("Error calling /api/stop:", error);
  }
};
