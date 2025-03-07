import { stream } from "undici";
import { Writable } from "stream";

async function fetchGitHubRepos() {
  const url = "https://api.github.com/users/nodejs/repos";

  const response = await stream(
    url,
    {
      method: "GET",
      headers: {
        "User-Agent": "undici-stream-example",
        Accept: "application/json",
      },
    },
    ({ statusCode }) => {
      let buffer = ""; // 用于累积所有数据块

      return new Writable({
        write(chunk, encoding, callback) {
          buffer += chunk.toString();
          callback();
        },
        final(callback) {
          console.log("Raw buffer content:", buffer); // 调试：输出原始 buffer 内容
          try {
            const json = JSON.parse(buffer);
            console.log("Parsed JSON:", json); // 调试：输出解析后的 JSON
            if (Array.isArray(json)) {
              console.log(
                "Repository Names:",
                json.map((repo) => repo.name)
              );
            } else {
              console.error("JSON is not an array:", json);
            }
          } catch (error) {
            console.error("Error parsing JSON:", error);
          }
          console.log("Stream processing completed.");
          callback();
        },
      });
    }
  );

  const { statusCode } = response; // 确保正确解构 statusCode
  console.log(`Response status: ${statusCode}`);
}

fetchGitHubRepos().catch(console.error);
