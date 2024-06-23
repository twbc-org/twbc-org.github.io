function fetchBlogEntries(options) {
  // Set default values using destructuring with default parameters
  const {
    baseUrl = "",
    maxResults = 10,
    openInNewTab = false, // Rename 'anotherOption' to 'openInNewTab' for clarity
    blogContentId = "blog-content", // Add blogContentId with a default value
  } = options || {}; // Ensure options is an object if undefined

  const url = `${baseUrl}/feeds/posts/default?max-results=${maxResults}&alt=json`;

  fetch(url)
    .then((response) => response.json())
    .then((json) => {
      const today = new Date();
      today.setDate(1);
      today.setMonth(today.getMonth() - 1);
      today.setHours(0, 0, 0);
      let body = '<table style="width: 100%;">';

      if (json.feed && json.feed.entry) {
        json.feed.entry.forEach((entry) => {
          const title = entry.title.$t;
          const content = entry.content.$t;
          const published = new Date(entry.published.$t);
          const blogUrl = entry.link.find(
            (link) => link.rel === "alternate",
          ).href;

          // Only include entries published on or after the first day of the current month
          if (published >= today) {
            // Conditionally add target attribute based on 'openInNewTab'
            const targetAttr = openInNewTab ? ' target="_blank"' : "";
            body += "<tr><td>";
            body += `<h3><a href="${blogUrl}"${targetAttr}>${title}</a></h3>`;
            body += "</td></tr><tr><td>";
            body += content;
            body += "</td></tr><tr><td align = "right">";
            body += `<div style="text-align: right;"><h3><a href="${blogUrl}"${targetAttr} class="read-more-btn">Read More</a></h3></div>`;
            body += "</td></tr>";
          }
        });
      } else {
        body = "<h3>No News is Bad News</h3>";
      }
      body += "</table>";

      document.getElementById(blogContentId).innerHTML = body;
    })
    .catch((error) => {
      console.error("Error fetching blog entries:", error);
      document.getElementById(blogContentId).innerHTML =
        "<h3>Error loading blog entries</h3>";
    });
}
