// Luxury websites often use subtle animations on scroll
document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Once visible, we can stop observing
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Helper to observe all current fade-in elements
    const observeAll = () => {
        document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
    };

    // Function to fetch and render the menu via API
    async function loadMenu() {
        try {
            const response = await fetch('menu.json');
            const menuData = await response.json();
            const menuContainer = document.getElementById('menu-items');
            
            // Clear current static content and inject new data
            menuContainer.innerHTML = menuData.map(item => `
                <div class="menu-item fade-in">
                    <h3>${item.name}</h3>
                    <p>${item.description}</p>
                    <span class="price">${item.price}</span>
                </div>
            `).join('');

            // Re-run observer for the newly injected elements
            observeAll();
            
        } catch (error) {
            console.error("Error loading menu:", error);
        }
    }

    // Function to fetch and render restaurant info via API
    async function loadInfo() {
        try {
            const response = await fetch('info.json');
            const info = await response.json();
            
            document.getElementById('address').textContent = info.location.address;
            document.getElementById('phone').textContent = info.location.phone;
            document.getElementById('hours').textContent = info.location.hours;
            document.getElementById('map-frame').src = info.location.map_url;
            document.getElementById('reserve-policy').textContent = info.reservation.policy;
            
            // Ensure location info fades in if it has the class
            observeAll();

        } catch (error) {
            console.error("Error loading info:", error);
        }
    }

    // Function to fetch a Beef-related dish from TheMealDB (Free Food API)
    async function loadFoodInspiration() {
        try {
            // We filter by 'Beef' to stay relevant to the Wagyu theme
            const listResponse = await fetch('https://www.themealdb.com/api/json/v1/1/filter.php?c=Beef');
            const listData = await listResponse.json();
            
            if (listData.meals) {
                // 1. Pick a random meal ID from the Beef category list
                const randomChoice = listData.meals[Math.floor(Math.random() * listData.meals.length)];
                
                // 2. Fetch full details using that specific ID to get more data (like origin)
                const detailResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${randomChoice.idMeal}`);
                const detailData = await detailResponse.json();
                const meal = detailData.meals[0];
                
                const container = document.getElementById('food-api-content');
                container.innerHTML = `
                    <div class="featured-dish fade-in">
                        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="inspiration-img">
                        <div class="inspiration-text">
                            <span class="label">Inspired by ${meal.strArea} Cuisine</span>
                            <h3>${meal.strMeal}</h3>
                            <p>Our chefs study global ${meal.strCategory} preparations to bring unique perspectives to our A5 Wagyu service.</p>
                        </div>
                    </div>
                `;

                observeAll();
            }
        } catch (error) {
            console.error("Error loading food inspiration:", error);
        }
    }

    // Initialize everything
    observeAll(); // Start observing static elements (like Hero) immediately
    loadMenu();
    loadInfo();
    loadFoodInspiration();
});