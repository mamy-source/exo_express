document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    // Mamorona ny Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // initialisation de AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100,
            easing: 'ease-out-cubic'
        });
    }

    
    // Navbar  menu
    const navItems = [
        { name: "Home", id: "home" },
        { name: "About", id: "story" },
        { name: "Features", id: "features" },
        { name: "Services", id: "services" },
        { name: "Testimonials", id: "testimonials" },
        { name: "Pricing", id: "pricing" },
        { name: "Team", id: "team" },
        { name: "Contact", id: "contact" }
    ];

    const navContainer = document.getElementById("navLinks");
    const mobileMenu = document.getElementById("mobileMenu");

    if (navContainer && mobileMenu) {
        navItems.forEach((item, index) => {
            // Desktop Links
            const li = document.createElement("li");
            li.innerHTML = `<a href="#${item.id}" class="nav-link text-gray-700 dark:text-gray-300 hover:text-red-500 transition px-4 py-2">${item.name}</a>`;
            navContainer.appendChild(li);

            // Mobile Links
            const mobileLink = document.createElement("a");
            mobileLink.href = `#${item.id}`;
            mobileLink.textContent = item.name;
            mobileLink.className = "block text-gray-700 dark:text-gray-300 hover:text-red-500 hover:bg-red-500/10 transition px-4 py-3 rounded-xl";
            mobileMenu.appendChild(mobileLink);
        });
    }

    // HAMBURGER MENU - FIKIRAKIRANA NY MENU       
    
    const menuBtn = document.getElementById("menuBtn");
    const mobileMenuElement = document.getElementById("mobileMenu");

    if (menuBtn && mobileMenuElement) {
        menuBtn.addEventListener("click", () => {
            menuBtn.classList.toggle("open");
            
            mobileMenuElement.classList.toggle("hidden");
            mobileMenuElement.classList.toggle("show");
            
            const icon = menuBtn.querySelector('i');
            if (icon) {
                if (icon.dataset.lucide === 'menu') {
                    icon.dataset.lucide = 'x';
                } else {
                    icon.dataset.lucide = 'menu';
                }
                lucide.createIcons();
            }
        });

        // Manidy ny menu rehefa misy click amin'ny link
        mobileMenuElement.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuElement.classList.add('hidden');
                mobileMenuElement.classList.remove('show');
                menuBtn.classList.remove('open');
                
                const icon = menuBtn.querySelector('i');
                if (icon) {
                    icon.dataset.lucide = 'menu';
                    lucide.createIcons();
                }
            });
        });
    }

    // ACTIVE LINK SY NAVBAR SCROLL EFFECT         
    
    const navbar = document.getElementById("navbar");
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".nav-link");

    // Fonction pour mettre à jour le lien actif
    function updateActiveLink() {
        let current = "";
        const scrollPosition = window.scrollY + 150; 

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                current = section.getAttribute("id");
            }
        });

        navLinks.forEach(link => {
            link.classList.remove("text-red-500", "active");
            if (link.getAttribute("href") === `#${current}`) {
                link.classList.add("text-red-500", "active");
            }
        });

        // Navbar background miova rehefa scrool
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
            navbar.querySelector('div > div').classList.add("bg-white/90", "dark:bg-gray-900/90", "shadow-xl");
        } else {
            navbar.classList.remove("scrolled");
            navbar.querySelector('div > div').classList.remove("bg-white/90", "dark:bg-gray-900/90", "shadow-xl");
        }
    }

    window.addEventListener("scroll", updateActiveLink);
    window.addEventListener("load", updateActiveLink);

    // DARK MODE TOGGLE                            
    
    const themeToggle = document.getElementById("themeToggle");
    
    // Jereo ny theme voatahiry
    if (localStorage.getItem("theme") === "dark") {
        document.documentElement.classList.add("dark");
        if (themeToggle) themeToggle.textContent = "☀️";
    }

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            document.documentElement.classList.toggle("dark");
            
            if (document.documentElement.classList.contains("dark")) {
                localStorage.setItem("theme", "dark");
                themeToggle.textContent = "☀️";
            } else {
                localStorage.setItem("theme", "light");
                themeToggle.textContent = "🌙";
            }
            
            // Refresh AOS rehefa miova ny theme
            if (typeof AOS !== 'undefined') {
                AOS.refresh();
            }
        });
    }

    // STATS COUNTER - FANISANA MIHAKATRA         
    
    const counters = document.querySelectorAll(".stat-number");
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseFloat(counter.getAttribute("data-target"));
                let count = 0;
                
                const isDecimal = target % 1 !== 0;
                const increment = target / 100;
                
                const updateCount = () => {
                    if (count < target) {
                        count += increment;
                        if (isDecimal) {
                            counter.innerText = count.toFixed(1);
                        } else {
                            counter.innerText = Math.floor(count);
                        }
                        requestAnimationFrame(updateCount);
                    } else {
                        counter.innerText = isDecimal ? target.toFixed(1) : Math.floor(target);
                    }
                };
                
                updateCount();
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.3 });

    counters.forEach(counter => counterObserver.observe(counter));

    // TESTIMONIAL SLIDER - INFINITE LOOP          
    
    const slider = document.getElementById("testimonialSlider");
    const nextBtn = document.getElementById("nextBtn");
    const prevBtn = document.getElementById("prevBtn");

    if (slider && nextBtn && prevBtn) {
        let cards = document.querySelectorAll(".testimonial-card");
        let cardCount = cards.length;
        
        // Clone ny cards voalohany sy farany ho an'ny infinite effect
        const firstClone = cards[0].cloneNode(true);
        const lastClone = cards[cardCount - 1].cloneNode(true);
        
        slider.appendChild(firstClone);
        slider.insertBefore(lastClone, cards[0]);
        
        // Update cards
        cards = document.querySelectorAll(".testimonial-card");
        let index = 1;
        const cardWidth = 33.333; 
        
        slider.style.transform = `translateX(-${index * cardWidth}%)`;
        
        // Active card
        const updateActiveCard = () => {
            cards.forEach(card => card.classList.remove("active"));
            cards[index].classList.add("active");
        };
        updateActiveCard();
        
        const nextSlide = () => {
            if (index >= cards.length - 1) return;
            index++;
            slider.style.transition = "transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)";
            slider.style.transform = `translateX(-${index * cardWidth}%)`;
            updateActiveCard();
        };
        
        const prevSlide = () => {
            if (index <= 0) return;
            index--;
            slider.style.transition = "transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)";
            slider.style.transform = `translateX(-${index * cardWidth}%)`;
            updateActiveCard();
        };
        
        // Infinite loop reset
        slider.addEventListener("transitionend", () => {
            if (cards[index] === firstClone) {
                slider.style.transition = "none";
                index = 1;
                slider.style.transform = `translateX(-${index * cardWidth}%)`;
            }
            
            if (cards[index] === lastClone) {
                slider.style.transition = "none";
                index = cards.length - 2;
                slider.style.transform = `translateX(-${index * cardWidth}%)`;
            }
        });
        
        nextBtn.addEventListener("click", nextSlide);
        prevBtn.addEventListener("click", prevSlide);
        
        let autoSlide = setInterval(nextSlide, 5000);
        
        slider.addEventListener("mouseenter", () => clearInterval(autoSlide));
        slider.addEventListener("mouseleave", () => {
            autoSlide = setInterval(nextSlide, 5000);
        });
    }

    // FAQ ACCORDION                               
    
    const faqItems = document.querySelectorAll(".faq-item");
    
    faqItems.forEach(item => {
        item.addEventListener("click", function() {
            const isActive = this.classList.contains("active");
            
            faqItems.forEach(el => {
                el.classList.remove("active");
                const icon = el.querySelector(".faq-icon");
                if (icon) icon.textContent = "+";
            });
            
            if (!isActive) {
                this.classList.add("active");
                const icon = this.querySelector(".faq-icon");
                if (icon) icon.textContent = "×";
            }
        });
    });

    // TEAM SLIDER                                 
    
    const teamSlider = document.getElementById("teamSlider");
    const teamNext = document.getElementById("teamNext");
    const teamPrev = document.getElementById("teamPrev");

    if (teamSlider && teamNext && teamPrev) {
        let teamIndex = 0;
        const teamCards = teamSlider.children;
        const cardsPerView = window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 4;
        const maxIndex = teamCards.length - cardsPerView;
        
        const updateTeamSlider = () => {
            teamSlider.style.transform = `translateX(-${teamIndex * (100 / cardsPerView)}%)`;
        };
        
        teamNext.addEventListener("click", () => {
            if (teamIndex < maxIndex) {
                teamIndex++;
            } else {
                teamIndex = 0;
            }
            updateTeamSlider();
        });
        
        teamPrev.addEventListener("click", () => {
            if (teamIndex > 0) {
                teamIndex--;
            } else {
                teamIndex = maxIndex;
            }
            updateTeamSlider();
        });
        
        window.addEventListener("resize", () => {
            const newCardsPerView = window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 4;
            teamIndex = 0;
            updateTeamSlider();
        });
    }

    // SMOOTH SCROLL HO AN'NY LINKS                //
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // FORM SUBMISSION - HANDLING                   //
    
    const contactForm = document.querySelector('#contact form');

    if (contactForm) {
    
      contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();
    
        // Maka data avy amin'ny form
        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());
    
        try {
    
          const response = await fetch("/api/contact", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
          });
    
          const result = await response.json();
    
          if (!response.ok) {
            alert("❌ " + result.message);
            return;
          }
    
          // Success
          alert("✅ Merci! votre message est bien reçue");
    
          // Reset form
          this.reset();
    
        } catch (error) {
          console.error(error);
          alert("❌ Server error. Ressayer.");
        }
    
      });
    
    }

    // PARALLAX EFFECT - HOME SECTION               //

    
    const heroSection = document.getElementById('home');
    if (heroSection) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            const floating1 = document.querySelector('.floating-1');
            const floating2 = document.querySelector('.floating-2');
            
            if (floating1) {
                floating1.style.transform = `translateY(${scrolled * 0.1}px)`;
            }
            if (floating2) {
                floating2.style.transform = `translateY(${-scrolled * 0.1}px)`;
            }
        });
    }

    //============================================//
    // LAZY LOADING - SURA                                 //
    //============================================//
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
    }

    // Debug - mijery raha mandeha tsara ny script
    console.log('✅ Royal Canin - Script loaded successfully!');
    console.log('📝 Commentaire en Malagasy - Azafady raha misy diso');
});