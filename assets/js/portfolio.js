const filterButtons = document.querySelectorAll("[data-filter]");
const projectCards = document.querySelectorAll(
  "[data-project-grid] [data-category]",
);
const filterStatus = document.querySelector("[data-filter-status]");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedCategory = button.dataset.filter;
    let visibleCount = 0;

    filterButtons.forEach((filterButton) => {
      filterButton.setAttribute(
        "aria-pressed",
        String(filterButton === button),
      );
    });

    projectCards.forEach((card) => {
      const isVisible =
        selectedCategory === "all" ||
        card.dataset.category === selectedCategory;
      card.hidden = !isVisible;
      if (isVisible) visibleCount += 1;
    });

    if (filterStatus) {
      const categoryName = button.textContent.trim();
      filterStatus.textContent = `Showing ${visibleCount} ${categoryName === "All work" ? "projects" : `${categoryName} projects`}.`;
    }
  });
});
