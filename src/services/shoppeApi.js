


export const GetApiShoppe = async (path) => {
  const response = await fetch(path, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36'
    },
  });
  const result = await response.json();
  return result;
}
