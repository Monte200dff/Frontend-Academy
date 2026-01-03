// ============================================
// GLOBAL STATE & CONFIGURATION
// ============================================

const APP_STATE = {
    isLoggedIn: false,
    currentUser: null,
    theme: localStorage.getItem('theme') || 'light',
    cart: [],
    savedCourses: [],
    activeCourseFilter: 'all',
    activeCategoryFilter: 'all',
    activeSort: 'popular',
    currentTeacherSlide: 0,
    modalStack: [],
    notifications: [],
    isMobile: false,
    isTablet: false,
    touchStartX: 0,
    touchEndX: 0
};

// Data storage for dynamic content
const DATA_STORE = {
    courses: [],
    teachers: [],
    blogPosts: [],
    testimonials: [],
    categories: ['html', 'css', 'javascript', 'react', 'vue', 'typescript', 'accessibility', 'performance', 'security', 'tools', 'devops']
};

// ============================================
// DOM ELEMENTS
// ============================================

const DOM = {
    body: document.body,
    themeToggle: null,
    loadingOverlay: null,
    
    header: null,
    hamburger: null,
    navMenu: null,
    navLinks: null,
    dropdowns: null,
    
    searchBtn: null,
    searchOverlay: null,
    searchClose: null,
    searchInput: null,
    
    announcementClose: null,
    announcementBar: null,
    
    modals: null,
    modalCloses: null,
    courseModal: null,
    loginModal: null,
    registerModal: null,
    dashboardModal: null,
    
    loginForm: null,
    registerForm: null,
    contactForm: null,
    newsletterForm: null,
    
    coursesGrid: null,
    filterTabs: null,
    categoryFilterContainer: null,
    sortSelect: null,
    
    teachersSlider: null,
    sliderPrev: null,
    sliderNext: null,
    sliderDots: null,
    
    blogGrid: null,
    
    faqQuestions: null,
    
    dashboardTabs: null,
    dashboardPanels: null,
    
    toast: null,
    toastClose: null,
    
    backToTop: null,
    
    loginBtn: null,
    registerBtn: null,
    switchToLogin: null,
    switchToRegister: null,
    chatWidget: null
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

const Utils = {
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    throttle: (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    formatCurrency: (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
        }).format(amount);
    },
    
    formatDate: (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    },
    
    generateId: () => {
        return '_' + Math.random().toString(36).substr(2, 9);
    },
    
    isValidEmail: (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },
    
    isValidPassword: (password) => {
        return password.length >= 8;
    },
    
    showLoading: () => {
        if (DOM.loadingOverlay) {
            DOM.loadingOverlay.classList.remove('hidden');
        }
    },
    
    hideLoading: () => {
        if (DOM.loadingOverlay) {
            DOM.loadingOverlay.classList.add('hidden');
        }
    },
    
    fadeIn: (element) => {
        if (!element) return;
        
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 100);
    },
    
    scrollToElement: (element, offset = 100) => {
        if (!element) return;
        
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    },
    
    getCategoryIcon: (category) => {
        const icons = {
            'html': 'fab fa-html5',
            'css': 'fab fa-css3-alt',
            'javascript': 'fab fa-js',
            'react': 'fab fa-react',
            'vue': 'fab fa-vuejs',
            'typescript': 'fab fa-js-square',
            'accessibility': 'fas fa-universal-access',
            'performance': 'fas fa-tachometer-alt',
            'security': 'fas fa-shield-alt',
            'tools': 'fas fa-tools',
            'devops': 'fab fa-docker'
        };
        return icons[category] || 'fas fa-code';
    },
    
    getCategoryLabel: (category) => {
        const labels = {
            'html': 'HTML',
            'css': 'CSS',
            'javascript': 'JavaScript',
            'react': 'React',
            'vue': 'Vue.js',
            'typescript': 'TypeScript',
            'accessibility': 'Accessibility',
            'performance': 'Performance',
            'security': 'Security',
            'tools': 'Tools',
            'devops': 'DevOps'
        };
        return labels[category] || category;
    },
    
    isTouchDevice: () => {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    },
    
    preventScroll: (prevent) => {
        if (prevent) {
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        }
    }
};

// ============================================
// INITIALIZE DOM ELEMENTS
// ============================================

const DOMInitializer = {
    init: () => {
        // Initialize all DOM elements with safe checks
        DOM.body = document.body;
        DOM.themeToggle = document.querySelector('.theme-toggle');
        DOM.loadingOverlay = document.getElementById('loadingOverlay');
        
        DOM.header = document.querySelector('.header');
        DOM.hamburger = document.querySelector('.hamburger');
        DOM.navMenu = document.querySelector('.nav-menu');
        DOM.navLinks = document.querySelectorAll('.nav-link');
        DOM.dropdowns = document.querySelectorAll('.has-dropdown');
        
        DOM.searchBtn = document.querySelector('.btn-search');
        DOM.searchOverlay = document.getElementById('searchOverlay');
        DOM.searchClose = document.querySelector('.search-close');
        DOM.searchInput = document.querySelector('.search-input');
        
        DOM.announcementClose = document.querySelector('.announcement-close');
        DOM.announcementBar = document.querySelector('.announcement-bar');
        
        DOM.modals = document.querySelectorAll('.modal');
        DOM.modalCloses = document.querySelectorAll('.modal-close');
        DOM.courseModal = document.getElementById('courseModal');
        DOM.loginModal = document.getElementById('loginModal');
        DOM.registerModal = document.getElementById('registerModal');
        DOM.dashboardModal = document.getElementById('dashboardModal');
        
        DOM.loginForm = document.getElementById('loginForm');
        DOM.registerForm = document.getElementById('registerForm');
        DOM.contactForm = document.getElementById('contactForm');
        DOM.newsletterForm = document.getElementById('newsletterForm');
        
        DOM.coursesGrid = document.getElementById('coursesGrid');
        DOM.filterTabs = document.querySelectorAll('.filter-tab');
        DOM.sortSelect = document.querySelector('.sort-select');
        
        DOM.teachersSlider = document.getElementById('teachersSlider');
        DOM.sliderPrev = document.querySelector('.slider-prev');
        DOM.sliderNext = document.querySelector('.slider-next');
        DOM.sliderDots = document.querySelector('.slider-dots');
        
        DOM.blogGrid = document.getElementById('blogGrid');
        
        DOM.faqQuestions = document.querySelectorAll('.faq-question');
        
        DOM.dashboardTabs = document.querySelectorAll('.dashboard-tab');
        DOM.dashboardPanels = document.querySelectorAll('.dashboard-panel');
        
        DOM.toast = document.getElementById('toast');
        DOM.toastClose = document.querySelector('.toast-close');
        
        DOM.backToTop = document.querySelector('.back-to-top');
        
        DOM.loginBtn = document.getElementById('loginBtn');
        DOM.registerBtn = document.getElementById('registerBtn');
        DOM.switchToLogin = document.getElementById('switchToLogin');
        DOM.switchToRegister = document.getElementById('switchToRegister');
        DOM.chatWidget = document.querySelector('.chat-widget');
        
        // Update screen size state
        APP_STATE.isMobile = window.innerWidth <= 768;
        APP_STATE.isTablet = window.innerWidth <= 1024 && window.innerWidth > 768;
    }
};

// ============================================
// DATA GENERATION & MANAGEMENT
// ============================================

const DataGenerator = {
    generateCourses: () => {
        return [
            // HTML Courses
            {
                id: 'course_html_fundamentals',
                title: 'HTML5 Fundamentals',
                description: 'Learn HTML5 from scratch. Master semantic markup, forms, multimedia, and accessibility.',
                category: 'html',
                level: 'beginner',
                price: 0,
                originalPrice: 49,
                duration: '15 hours',
                lessons: 12,
                students: 45200,
                rating: 4.5,
                instructor: { name: 'David Kim', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David' },
                featured: false,
                tags: ['HTML5', 'Semantic', 'Forms']
            },
            {
                id: 'course_html_advanced',
                title: 'Advanced HTML5',
                description: 'Deep dive into HTML5 APIs, web components, canvas, and advanced form validation.',
                category: 'html',
                level: 'intermediate',
                price: 79,
                originalPrice: 129,
                duration: '20 hours',
                lessons: 16,
                students: 18500,
                rating: 4.7,
                instructor: { name: 'Mike Rodriguez', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike' },
                featured: false,
                tags: ['HTML5 APIs', 'Web Components']
            },

            // CSS Courses
            {
                id: 'course_css_basics',
                title: 'CSS Complete Guide',
                description: 'Master CSS3 including Flexbox, Grid, animations, transitions, and responsive design.',
                category: 'css',
                level: 'beginner',
                price: 89,
                originalPrice: 129,
                duration: '25 hours',
                lessons: 18,
                students: 32500,
                rating: 4.7,
                instructor: { name: 'Mike Rodriguez', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike2' },
                featured: true,
                tags: ['CSS3', 'Flexbox', 'Grid']
            },
            {
                id: 'course_sass_scss',
                title: 'SASS/SCSS Mastery',
                description: 'Learn SASS and SCSS preprocessing to write maintainable and scalable CSS.',
                category: 'css',
                level: 'intermediate',
                price: 99,
                originalPrice: 149,
                duration: '18 hours',
                lessons: 14,
                students: 18500,
                rating: 4.6,
                instructor: { name: 'Lisa Chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa' },
                featured: false,
                tags: ['SASS', 'SCSS', 'Preprocessing']
            },

            // JavaScript Courses
            {
                id: 'course_js_fundamentals',
                title: 'JavaScript Fundamentals',
                description: 'Learn JavaScript from scratch: variables, functions, loops, arrays, and objects.',
                category: 'javascript',
                level: 'beginner',
                price: 0,
                originalPrice: 89,
                duration: '30 hours',
                lessons: 22,
                students: 58500,
                rating: 4.6,
                instructor: { name: 'Sarah Chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah2' },
                featured: false,
                tags: ['JavaScript', 'Basics', 'Fundamentals']
            },
            {
                id: 'course_js_advanced',
                title: 'Advanced JavaScript',
                description: 'Master closures, prototypes, async programming, and advanced patterns.',
                category: 'javascript',
                level: 'intermediate',
                price: 149,
                originalPrice: 199,
                duration: '36 hours',
                lessons: 24,
                students: 18500,
                rating: 4.8,
                instructor: { name: 'Sarah Chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah3' },
                featured: true,
                tags: ['JavaScript', 'Advanced', 'Async']
            },

            // React Courses
            {
                id: 'course_react_basics',
                title: 'React Fundamentals',
                description: 'Learn React basics: components, props, state, and event handling.',
                category: 'react',
                level: 'beginner',
                price: 129,
                originalPrice: 179,
                duration: '32 hours',
                lessons: 22,
                students: 38500,
                rating: 4.7,
                instructor: { name: 'Alex Johnson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
                featured: false,
                tags: ['React', 'Components', 'Props']
            },
            {
                id: 'course_react_hooks',
                title: 'React Hooks Deep Dive',
                description: 'Master useState, useEffect, useContext, and custom hooks.',
                category: 'react',
                level: 'intermediate',
                price: 149,
                originalPrice: 199,
                duration: '28 hours',
                lessons: 20,
                students: 29500,
                rating: 4.8,
                instructor: { name: 'Alex Johnson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex3' },
                featured: true,
                tags: ['React Hooks', 'useState', 'useEffect']
            },

            // Vue.js Courses
            {
                id: 'course_vue_basics',
                title: 'Vue.js Fundamentals',
                description: 'Learn Vue.js from scratch: directives, components, and Vue instance.',
                category: 'vue',
                level: 'beginner',
                price: 119,
                originalPrice: 169,
                duration: '30 hours',
                lessons: 21,
                students: 24500,
                rating: 4.7,
                instructor: { name: 'Emma Wilson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma3' },
                featured: false,
                tags: ['Vue.js', 'Directives', 'Components']
            },
            {
                id: 'course_vue_composition',
                title: 'Vue 3 Composition API',
                description: 'Master Vue 3 Composition API, reactivity, and composition functions.',
                category: 'vue',
                level: 'intermediate',
                price: 149,
                originalPrice: 199,
                duration: '32 hours',
                lessons: 22,
                students: 16800,
                rating: 4.8,
                instructor: { name: 'Emma Wilson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma4' },
                featured: true,
                tags: ['Vue 3', 'Composition API', 'Reactivity']
            },

            // TypeScript Courses
            {
                id: 'course_typescript_basics',
                title: 'TypeScript Fundamentals',
                description: 'Learn TypeScript basics: types, interfaces, classes, and type annotations.',
                category: 'typescript',
                level: 'intermediate',
                price: 139,
                originalPrice: 189,
                duration: '30 hours',
                lessons: 22,
                students: 28500,
                rating: 4.8,
                instructor: { name: 'Sarah Chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah5' },
                featured: true,
                tags: ['TypeScript', 'Types', 'Interfaces']
            }
        ];
    },
    
    generateTeachers: () => {
        return [
            {
                id: 'teacher_1',
                name: 'Alex Johnson',
                role: 'Senior Frontend Engineer',
                company: 'Meta',
                experience: '10+ years',
                courses: 8,
                students: 45000,
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
                bio: 'Specialized in React ecosystem and performance optimization.',
                skills: ['React', 'TypeScript', 'Performance']
            },
            {
                id: 'teacher_2',
                name: 'Sarah Chen',
                role: 'Frontend Architect',
                company: 'Netflix',
                experience: '8+ years',
                courses: 6,
                students: 38000,
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
                bio: 'Expert in JavaScript, Vue.js, and state management patterns.',
                skills: ['JavaScript', 'Vue.js', 'State Management']
            }
        ];
    },
    
    generateBlogPosts: () => {
        return [
            {
                id: 'blog_1',
                title: 'React Server Components: The Future',
                excerpt: 'Deep dive into React Server Components and how they change React development.',
                category: 'React',
                date: '2024-03-15',
                readTime: '8 min',
                author: 'Alex Johnson',
                image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop'
            },
            {
                id: 'blog_2',
                title: 'Mastering CSS Grid',
                excerpt: 'Learn advanced CSS Grid techniques through practical layout examples.',
                category: 'CSS',
                date: '2024-03-10',
                readTime: '12 min',
                author: 'Mike Rodriguez',
                image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop'
            }
        ];
    }
};

// ============================================
// THEME MANAGEMENT
// ============================================

const ThemeManager = {
    init: () => {
        if (!DOM.themeToggle) return;
        
        DOM.body.setAttribute('data-theme', APP_STATE.theme);
        ThemeManager.updateToggleButton();
        DOM.themeToggle.addEventListener('click', ThemeManager.toggle);
    },
    
    toggle: () => {
        const newTheme = APP_STATE.theme === 'light' ? 'dark' : 'light';
        APP_STATE.theme = newTheme;
        
        DOM.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        ThemeManager.updateToggleButton();
        
        DOM.themeToggle.classList.add('theme-transition');
        setTimeout(() => {
            DOM.themeToggle.classList.remove('theme-transition');
        }, 300);
    },
    
    updateToggleButton: () => {
        if (!DOM.themeToggle) return;
        
        const icon = DOM.themeToggle.querySelector('i');
        if (!icon) return;
        
        if (APP_STATE.theme === 'dark') {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }
};

// ============================================
// NAVIGATION & MENU MANAGEMENT (MOBILE OPTIMIZED)
// ============================================

const Navigation = {
    init: () => {
        if (!DOM.hamburger || !DOM.navMenu) return;
        
        // Mobile menu toggle
        DOM.hamburger.addEventListener('click', Navigation.toggleMobileMenu);
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (DOM.navMenu.classList.contains('active') && 
                !DOM.hamburger.contains(e.target) && 
                !DOM.navMenu.contains(e.target)) {
                Navigation.closeMobileMenu();
            }
        });
        
        // Nav link active state
        if (DOM.navLinks) {
            DOM.navLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    // Remove active class from all links
                    DOM.navLinks.forEach(l => l.classList.remove('active'));
                    
                    // Add active class to clicked link
                    e.target.classList.add('active');
                    
                    // Close mobile menu on mobile
                    if (APP_STATE.isMobile) {
                        Navigation.closeMobileMenu();
                    }
                });
            });
        }
        
        // Dropdown interactions for mobile
        if (DOM.dropdowns) {
            DOM.dropdowns.forEach(dropdown => {
                const link = dropdown.querySelector('.nav-link');
                const dropdownIcon = dropdown.querySelector('.dropdown-icon');
                
                if (link && dropdownIcon) {
                    link.addEventListener('click', (e) => {
                        if (APP_STATE.isMobile) {
                            e.preventDefault();
                            e.stopPropagation();
                            
                            // Close other dropdowns
                            DOM.dropdowns.forEach(d => {
                                if (d !== dropdown) {
                                    d.classList.remove('open');
                                }
                            });
                            
                            // Toggle current dropdown
                            dropdown.classList.toggle('open');
                            
                            // Rotate icon
                            if (dropdown.classList.contains('open')) {
                                dropdownIcon.style.transform = 'rotate(180deg)';
                            } else {
                                dropdownIcon.style.transform = 'rotate(0deg)';
                            }
                        }
                    });
                }
            });
        }
        
        // Header scroll effect
        window.addEventListener('scroll', Utils.throttle(Navigation.handleHeaderScroll, 100));
        
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#' || href === '#!') return;
                
                e.preventDefault();
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    Utils.scrollToElement(targetElement);
                    
                    // Close mobile menu if open
                    if (APP_STATE.isMobile) {
                        Navigation.closeMobileMenu();
                    }
                }
            });
        });
        
        // Close dropdowns when clicking elsewhere on mobile
        if (APP_STATE.isMobile) {
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.has-dropdown')) {
                    DOM.dropdowns.forEach(dropdown => {
                        dropdown.classList.remove('open');
                        const icon = dropdown.querySelector('.dropdown-icon');
                        if (icon) {
                            icon.style.transform = 'rotate(0deg)';
                        }
                    });
                }
            });
        }
    },
    
    toggleMobileMenu: () => {
        if (!DOM.hamburger || !DOM.navMenu) return;
        
        DOM.hamburger.classList.toggle('active');
        DOM.navMenu.classList.toggle('active');
        
        if (DOM.navMenu.classList.contains('active')) {
            Utils.preventScroll(true);
            
            // Close all dropdowns when opening mobile menu
            DOM.dropdowns.forEach(dropdown => {
                dropdown.classList.remove('open');
                const icon = dropdown.querySelector('.dropdown-icon');
                if (icon) {
                    icon.style.transform = 'rotate(0deg)';
                }
            });
        } else {
            Utils.preventScroll(false);
        }
    },
    
    closeMobileMenu: () => {
        if (!DOM.hamburger || !DOM.navMenu) return;
        
        DOM.hamburger.classList.remove('active');
        DOM.navMenu.classList.remove('active');
        Utils.preventScroll(false);
        
        // Reset dropdown icons
        DOM.dropdowns.forEach(dropdown => {
            const icon = dropdown.querySelector('.dropdown-icon');
            if (icon) {
                icon.style.transform = 'rotate(0deg)';
            }
        });
    },
    
    handleHeaderScroll: () => {
        if (!DOM.header || !DOM.backToTop) return;
        
        if (window.scrollY > 100) {
            DOM.header.classList.add('scrolled');
        } else {
            DOM.header.classList.remove('scrolled');
        }
        
        // Back to top button
        if (window.scrollY > 500) {
            DOM.backToTop.classList.add('visible');
        } else {
            DOM.backToTop.classList.remove('visible');
        }
    }
};

// ============================================
// COURSE MANAGEMENT WITH MOBILE TOUCH SUPPORT
// ============================================

const CourseManager = {
    init: () => {
        DATA_STORE.courses = DataGenerator.generateCourses();
        
        // Create category filters if container exists
        CourseManager.createCategoryFilters();
        
        // Render courses
        if (DOM.coursesGrid) {
            CourseManager.renderCourses(DATA_STORE.courses);
        }
        
        // Level filter tabs
        if (DOM.filterTabs) {
            DOM.filterTabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    const filter = tab.dataset.filter;
                    
                    DOM.filterTabs.forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');
                    
                    APP_STATE.activeCourseFilter = filter;
                    CourseManager.applyFiltersAndSort();
                });
            });
        }
        
        // Sort select
        if (DOM.sortSelect) {
            DOM.sortSelect.addEventListener('change', (e) => {
                APP_STATE.activeSort = e.target.value;
                CourseManager.applyFiltersAndSort();
            });
        }
        
        // Setup touch events for mobile course cards
        CourseManager.setupTouchEvents();
        
        // Initialize course modal
        CourseManager.initCourseModal();
    },
    
    createCategoryFilters: () => {
        // Find or create category filters container
        let categoryContainer = document.querySelector('.category-filters');
        
        if (!categoryContainer) {
            const coursesControls = document.querySelector('.courses-controls');
            if (coursesControls) {
                categoryContainer = document.createElement('div');
                categoryContainer.className = 'category-filters';
                coursesControls.insertBefore(categoryContainer, coursesControls.firstChild);
            }
        }
        
        if (categoryContainer) {
            // Clear existing buttons
            categoryContainer.innerHTML = '';
            
            // Create "All" button
            const allButton = document.createElement('button');
            allButton.className = 'category-filter active';
            allButton.dataset.category = 'all';
            allButton.innerHTML = '<i class="fas fa-th"></i> All';
            categoryContainer.appendChild(allButton);
            
            // Create category buttons
            DATA_STORE.categories.forEach(category => {
                const button = document.createElement('button');
                button.className = 'category-filter';
                button.dataset.category = category;
                button.innerHTML = `<i class="${Utils.getCategoryIcon(category)}"></i> ${Utils.getCategoryLabel(category)}`;
                categoryContainer.appendChild(button);
            });
            
            // Add click events
            categoryContainer.querySelectorAll('.category-filter').forEach(button => {
                button.addEventListener('click', function() {
                    const category = this.dataset.category;
                    
                    // Remove active class from all buttons
                    categoryContainer.querySelectorAll('.category-filter').forEach(btn => {
                        btn.classList.remove('active');
                    });
                    
                    // Add active class to clicked button
                    this.classList.add('active');
                    
                    // Update state and filter
                    APP_STATE.activeCategoryFilter = category;
                    CourseManager.applyFiltersAndSort();
                    
                    // Show notification on mobile
                    if (APP_STATE.isMobile && category !== 'all') {
                        const label = Utils.getCategoryLabel(category);
                        NotificationManager.showToast(`${label} courses`);
                    }
                });
            });
        }
    },
    
    renderCourses: (courses) => {
        if (!DOM.coursesGrid) return;
        
        DOM.coursesGrid.innerHTML = '';
        
        if (courses.length === 0) {
            DOM.coursesGrid.innerHTML = `
                <div class="no-courses-message">
                    <i class="fas fa-search"></i>
                    <h3>No courses found</h3>
                    <p>Try changing your filters</p>
                    <button class="btn btn-outline reset-filters">Show All Courses</button>
                </div>
            `;
            
            // Reset filters button
            const resetBtn = DOM.coursesGrid.querySelector('.reset-filters');
            if (resetBtn) {
                resetBtn.addEventListener('click', CourseManager.resetFilters);
            }
            return;
        }
        
        courses.forEach((course, index) => {
            const courseCard = CourseManager.createCourseCard(course);
            DOM.coursesGrid.appendChild(courseCard);
            
            // Add fade-in animation with delay
            setTimeout(() => {
                Utils.fadeIn(courseCard);
            }, 50 * index);
        });
    },
    
    createCourseCard: (course) => {
        const card = document.createElement('div');
        card.className = 'course-card card';
        card.dataset.id = course.id;
        card.dataset.level = course.level;
        card.dataset.category = course.category;
        
        const discount = course.originalPrice > 0 
            ? Math.round((1 - course.price / course.originalPrice) * 100)
            : 0;
        
        card.innerHTML = `
            <div class="course-card-image">
                <div class="course-card-level">
                    <span class="badge ${course.level === 'beginner' ? 'badge-success' : course.level === 'intermediate' ? 'badge-warning' : 'badge-danger'}">
                        ${course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                    </span>
                </div>
                ${discount > 0 ? `<div class="course-card-discount">${discount}% OFF</div>` : ''}
                ${course.featured ? `<div class="course-card-featured"><i class="fas fa-star"></i> Featured</div>` : ''}
            </div>
            <div class="course-card-content">
                <div class="course-card-category">
                    <i class="${Utils.getCategoryIcon(course.category)}"></i>
                    <span>${Utils.getCategoryLabel(course.category)}</span>
                </div>
                <h3 class="course-card-title">${course.title}</h3>
                <p class="course-card-description">${course.description}</p>
                <div class="course-card-meta">
                    <div class="course-card-instructor">
                        <img src="${course.instructor.avatar}" alt="${course.instructor.name}" class="course-card-instructor-avatar">
                        <span>${course.instructor.name}</span>
                    </div>
                    <div class="course-card-price ${course.price === 0 ? 'free' : ''}">
                        ${course.price === 0 ? 'FREE' : Utils.formatCurrency(course.price)}
                        ${course.originalPrice > course.price ? 
                            `<span class="original-price">${Utils.formatCurrency(course.originalPrice)}</span>` : ''}
                    </div>
                </div>
                <div class="course-card-footer">
                    <div class="course-card-stats">
                        <span><i class="far fa-clock"></i> ${course.duration}</span>
                        <span><i class="fas fa-star"></i> ${course.rating}</span>
                    </div>
                    <div class="course-card-actions">
                        <button class="btn btn-outline btn-small btn-enroll" data-course="${course.id}">
                            ${course.price === 0 ? 'Start Free' : 'Enroll Now'}
                        </button>
                        <button class="btn-icon btn-save" data-course="${course.id}" aria-label="Save course">
                            <i class="far fa-bookmark"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Add event listeners
        const enrollBtn = card.querySelector('.btn-enroll');
        const saveBtn = card.querySelector('.btn-save');
        
        if (enrollBtn) {
            enrollBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                CourseManager.handleEnroll(course.id);
            });
        }
        
        if (saveBtn) {
            saveBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                CourseManager.toggleSaveCourse(course.id, saveBtn);
            });
        }
        
        // Card click for details
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.btn-enroll') && !e.target.closest('.btn-save')) {
                CourseManager.showCourseDetail(course.id);
            }
        });
        
        return card;
    },
    
    setupTouchEvents: () => {
        if (!Utils.isTouchDevice()) return;
        
        // Add touch feedback to course cards
        document.addEventListener('touchstart', (e) => {
            if (e.target.closest('.course-card')) {
                e.target.closest('.course-card').classList.add('touch-active');
            }
        }, { passive: true });
        
        document.addEventListener('touchend', (e) => {
            if (e.target.closest('.course-card')) {
                e.target.closest('.course-card').classList.remove('touch-active');
            }
        }, { passive: true });
        
        // Prevent long press on buttons
        document.querySelectorAll('.btn, .btn-icon').forEach(button => {
            button.addEventListener('contextmenu', (e) => e.preventDefault());
            button.style.webkitTouchCallout = 'none';
        });
    },
    
    applyFiltersAndSort: () => {
        let filteredCourses = [...DATA_STORE.courses];
        
        // Apply level filter
        if (APP_STATE.activeCourseFilter !== 'all') {
            filteredCourses = filteredCourses.filter(course => 
                course.level === APP_STATE.activeCourseFilter
            );
        }
        
        // Apply category filter
        if (APP_STATE.activeCategoryFilter !== 'all') {
            filteredCourses = filteredCourses.filter(course => 
                course.category === APP_STATE.activeCategoryFilter
            );
        }
        
        // Apply sort
        switch (APP_STATE.activeSort) {
            case 'newest':
                filteredCourses.reverse();
                break;
            case 'rating':
                filteredCourses.sort((a, b) => b.rating - a.rating);
                break;
            case 'price-low':
                filteredCourses.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filteredCourses.sort((a, b) => b.price - a.price);
                break;
            case 'popular':
            default:
                filteredCourses.sort((a, b) => b.students - a.students);
                break;
        }
        
        CourseManager.renderCourses(filteredCourses);
        
        // Show results count on mobile
        if (APP_STATE.isMobile && filteredCourses.length > 0) {
            setTimeout(() => {
                NotificationManager.showToast(`${filteredCourses.length} courses found`);
            }, 300);
        }
    },
    
    resetFilters: () => {
        APP_STATE.activeCourseFilter = 'all';
        APP_STATE.activeCategoryFilter = 'all';
        APP_STATE.activeSort = 'popular';
        
        // Update UI
        if (DOM.filterTabs) {
            DOM.filterTabs.forEach(tab => {
                tab.classList.toggle('active', tab.dataset.filter === 'all');
            });
        }
        
        if (DOM.sortSelect) {
            DOM.sortSelect.value = 'popular';
        }
        
        // Reset category buttons
        const categoryButtons = document.querySelectorAll('.category-filter');
        if (categoryButtons) {
            categoryButtons.forEach(btn => {
                btn.classList.toggle('active', btn.dataset.category === 'all');
            });
        }
        
        CourseManager.applyFiltersAndSort();
        NotificationManager.showToast('Filters reset');
    },
    
    handleEnroll: (courseId) => {
        const course = DATA_STORE.courses.find(c => c.id === courseId);
        if (!course) return;
        
        if (!APP_STATE.isLoggedIn && course.price > 0) {
            ModalManager.open(DOM.loginModal);
            NotificationManager.showToast('Please login to enroll');
            return;
        }
        
        APP_STATE.cart.push(courseId);
        
        NotificationManager.showToast(`Added "${course.title}" to your ${course.price === 0 ? 'learning' : 'cart'}!`);
        
        const enrollBtn = document.querySelector(`.btn-enroll[data-course="${courseId}"]`);
        if (enrollBtn) {
            enrollBtn.textContent = course.price === 0 ? 'Started' : 'Added to Cart';
            enrollBtn.classList.remove('btn-outline');
            enrollBtn.classList.add('btn-primary');
            enrollBtn.disabled = true;
            
            setTimeout(() => {
                enrollBtn.textContent = course.price === 0 ? 'Start Free' : 'Enroll Now';
                enrollBtn.classList.remove('btn-primary');
                enrollBtn.classList.add('btn-outline');
                enrollBtn.disabled = false;
            }, 3000);
        }
    },
    
    toggleSaveCourse: (courseId, button) => {
        const course = DATA_STORE.courses.find(c => c.id === courseId);
        if (!course) return;
        
        const icon = button.querySelector('i');
        const isSaved = APP_STATE.savedCourses.includes(courseId);
        
        if (isSaved) {
            APP_STATE.savedCourses = APP_STATE.savedCourses.filter(id => id !== courseId);
            icon.classList.remove('fas');
            icon.classList.add('far');
            NotificationManager.showToast(`Removed "${course.title}" from saved`);
        } else {
            APP_STATE.savedCourses.push(courseId);
            icon.classList.remove('far');
            icon.classList.add('fas');
            NotificationManager.showToast(`Saved "${course.title}"`);
        }
    },
    
    initCourseModal: () => {
        // Course modal initialization will be handled by ModalManager
    },
    
    showCourseDetail: (courseId) => {
        const course = DATA_STORE.courses.find(c => c.id === courseId);
        if (!course || !DOM.courseModal) return;
        
        const modalContent = document.getElementById('courseModalContent');
        if (!modalContent) return;
        
        modalContent.innerHTML = CourseManager.createCourseDetailHTML(course);
        ModalManager.open(DOM.courseModal);
        
        // Add event listeners for modal buttons
        setTimeout(() => {
            const enrollBtn = modalContent.querySelector('.btn-enroll-detail');
            const saveBtn = modalContent.querySelector('.btn-save-detail');
            
            if (enrollBtn) {
                enrollBtn.addEventListener('click', () => {
                    CourseManager.handleEnroll(courseId);
                    ModalManager.closeActiveModal();
                });
            }
            
            if (saveBtn) {
                saveBtn.addEventListener('click', () => {
                    const icon = saveBtn.querySelector('i');
                    const isSaved = APP_STATE.savedCourses.includes(courseId);
                    
                    if (isSaved) {
                        APP_STATE.savedCourses = APP_STATE.savedCourses.filter(id => id !== courseId);
                        icon.classList.remove('fas');
                        icon.classList.add('far');
                        saveBtn.innerHTML = '<i class="far fa-bookmark"></i> Save for Later';
                    } else {
                        APP_STATE.savedCourses.push(courseId);
                        icon.classList.remove('far');
                        icon.classList.add('fas');
                        saveBtn.innerHTML = '<i class="fas fa-bookmark"></i> Saved';
                    }
                });
            }
        }, 100);
    },
    
    createCourseDetailHTML: (course) => {
        return `
            <div class="course-detail">
                <div class="course-detail-header">
                    <div class="course-detail-badge">
                        <span class="badge ${course.level === 'beginner' ? 'badge-success' : course.level === 'intermediate' ? 'badge-warning' : 'badge-danger'}">
                            ${course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                        </span>
                        <span class="badge category-badge">
                            <i class="${Utils.getCategoryIcon(course.category)}"></i>
                            ${Utils.getCategoryLabel(course.category)}
                        </span>
                    </div>
                    <h2>${course.title}</h2>
                    <p class="course-detail-description">${course.description}</p>
                </div>
                
                <div class="course-detail-content">
                    <div class="course-detail-instructor">
                        <img src="${course.instructor.avatar}" alt="${course.instructor.name}">
                        <div>
                            <h4>Instructor</h4>
                            <h3>${course.instructor.name}</h3>
                        </div>
                    </div>
                    
                    <div class="course-detail-syllabus">
                        <h3>What You'll Learn</h3>
                        <ul>
                            <li>Master ${course.category} fundamentals</li>
                            <li>Build real-world projects</li>
                            <li>Learn industry best practices</li>
                            <li>Get ready for technical interviews</li>
                        </ul>
                    </div>
                    
                    <div class="course-detail-price-card">
                        <div class="price-header">
                            <h3>Course Fee</h3>
                            <div class="price">
                                ${course.price === 0 ? 'FREE' : Utils.formatCurrency(course.price)}
                                ${course.originalPrice > course.price ? 
                                    `<span class="original-price">${Utils.formatCurrency(course.originalPrice)}</span>` : ''}
                            </div>
                        </div>
                        
                        <div class="course-stats">
                            <div class="stat">
                                <i class="far fa-clock"></i>
                                <span>${course.duration}</span>
                            </div>
                            <div class="stat">
                                <i class="fas fa-star"></i>
                                <span>${course.rating} rating</span>
                            </div>
                        </div>
                        
                        <div class="course-actions">
                            <button class="btn btn-primary btn-block btn-enroll-detail" data-course="${course.id}">
                                ${course.price === 0 ? 'Start Learning Free' : 'Enroll Now'}
                            </button>
                            <button class="btn btn-outline btn-block btn-save-detail" data-course="${course.id}">
                                <i class="${APP_STATE.savedCourses.includes(course.id) ? 'fas' : 'far'} fa-bookmark"></i> 
                                ${APP_STATE.savedCourses.includes(course.id) ? 'Saved' : 'Save for Later'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
};

// ============================================
// TEACHERS SLIDER WITH TOUCH SUPPORT
// ============================================

const TeachersSlider = {
    init: () => {
        DATA_STORE.teachers = DataGenerator.generateTeachers();
        
        if (!DOM.teachersSlider) return;
        
        TeachersSlider.renderTeachers();
        TeachersSlider.initControls();
        TeachersSlider.setupTouchEvents();
        
        if (!APP_STATE.isMobile) {
            TeachersSlider.startAutoSlide();
        }
    },
    
    renderTeachers: () => {
        if (!DOM.teachersSlider) return;
        
        DOM.teachersSlider.innerHTML = '';
        
        DATA_STORE.teachers.forEach((teacher, index) => {
            const teacherCard = TeachersSlider.createTeacherCard(teacher);
            teacherCard.dataset.index = index;
            DOM.teachersSlider.appendChild(teacherCard);
        });
        
        TeachersSlider.createDots();
    },
    
    createTeacherCard: (teacher) => {
        const card = document.createElement('div');
        card.className = 'teacher-card card slider-item';
        
        card.innerHTML = `
            <div class="teacher-card-header">
                <img src="${teacher.avatar}" alt="${teacher.name}" class="teacher-avatar">
            </div>
            <div class="teacher-card-body">
                <h3 class="teacher-name">${teacher.name}</h3>
                <p class="teacher-role">${teacher.role}</p>
                <p class="teacher-company"><i class="fas fa-building"></i> ${teacher.company}</p>
                
                <div class="teacher-stats">
                    <div class="teacher-stat">
                        <span class="stat-number">${teacher.experience}</span>
                        <span class="stat-label">Experience</span>
                    </div>
                    <div class="teacher-stat">
                        <span class="stat-number">${teacher.courses}</span>
                        <span class="stat-label">Courses</span>
                    </div>
                </div>
                
                <div class="teacher-skills">
                    ${teacher.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                </div>
                
                <p class="teacher-bio">${teacher.bio}</p>
            </div>
        `;
        
        return card;
    },
    
    createDots: () => {
        if (!DOM.sliderDots) return;
        
        DOM.sliderDots.innerHTML = '';
        
        for (let i = 0; i < DATA_STORE.teachers.length; i++) {
            const dot = document.createElement('button');
            dot.className = `slider-dot ${i === 0 ? 'active' : ''}`;
            dot.dataset.index = i;
            dot.setAttribute('aria-label', `Slide ${i + 1}`);
            dot.setAttribute('tabindex', '0');
            
            dot.addEventListener('click', () => {
                TeachersSlider.goToSlide(i);
            });
            
            // Add keyboard support
            dot.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    TeachersSlider.goToSlide(i);
                }
            });
            
            DOM.sliderDots.appendChild(dot);
        }
    },
    
    initControls: () => {
        if (!DOM.sliderPrev || !DOM.sliderNext) return;
        
        DOM.sliderPrev.addEventListener('click', () => {
            TeachersSlider.prevSlide();
        });
        
        DOM.sliderNext.addEventListener('click', () => {
            TeachersSlider.nextSlide();
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                TeachersSlider.prevSlide();
            } else if (e.key === 'ArrowRight') {
                TeachersSlider.nextSlide();
            }
        });
        
        // Hide arrows on mobile if too many items
        if (APP_STATE.isMobile && DATA_STORE.teachers.length <= 2) {
            DOM.sliderPrev.style.display = 'none';
            DOM.sliderNext.style.display = 'none';
        }
    },
    
    setupTouchEvents: () => {
        if (!DOM.teachersSlider || !Utils.isTouchDevice()) return;
        
        DOM.teachersSlider.addEventListener('touchstart', (e) => {
            APP_STATE.touchStartX = e.touches[0].clientX;
        }, { passive: true });
        
        DOM.teachersSlider.addEventListener('touchmove', (e) => {
            APP_STATE.touchEndX = e.touches[0].clientX;
        }, { passive: true });
        
        DOM.teachersSlider.addEventListener('touchend', () => {
            const threshold = 50; // Minimum swipe distance
            const diff = APP_STATE.touchStartX - APP_STATE.touchEndX;
            
            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    // Swipe left - next slide
                    TeachersSlider.nextSlide();
                } else {
                    // Swipe right - previous slide
                    TeachersSlider.prevSlide();
                }
            }
        }, { passive: true });
    },
    
    nextSlide: () => {
        const nextIndex = (APP_STATE.currentTeacherSlide + 1) % DATA_STORE.teachers.length;
        TeachersSlider.goToSlide(nextIndex);
    },
    
    prevSlide: () => {
        const prevIndex = APP_STATE.currentTeacherSlide === 0 
            ? DATA_STORE.teachers.length - 1 
            : APP_STATE.currentTeacherSlide - 1;
        TeachersSlider.goToSlide(prevIndex);
    },
    
    goToSlide: (index) => {
        APP_STATE.currentTeacherSlide = index;
        
        if (!DOM.teachersSlider) return;
        
        const sliderWidth = DOM.teachersSlider.clientWidth;
        const itemWidth = DOM.teachersSlider.querySelector('.slider-item')?.clientWidth || 300;
        const gap = APP_STATE.isMobile ? 16 : 32;
        const scrollPosition = index * (itemWidth + gap);
        
        DOM.teachersSlider.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });
        
        // Update dots
        if (DOM.sliderDots) {
            document.querySelectorAll('.slider-dot').forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        }
    },
    
    startAutoSlide: () => {
        if (APP_STATE.isMobile) return; // Don't auto-slide on mobile
        
        setInterval(() => {
            if (document.hasFocus() && !APP_STATE.modalStack.length) {
                TeachersSlider.nextSlide();
            }
        }, 5000);
    }
};

// ============================================
// MODAL MANAGEMENT (MOBILE OPTIMIZED)
// ============================================

const ModalManager = {
    init: () => {
        if (!DOM.modalCloses) return;
        
        // Close buttons
        DOM.modalCloses.forEach(closeBtn => {
            closeBtn.addEventListener('click', ModalManager.closeActiveModal);
        });
        
        // Close modal on backdrop click
        DOM.modals.forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    ModalManager.closeActiveModal();
                }
            });
        });
        
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && APP_STATE.modalStack.length > 0) {
                ModalManager.closeActiveModal();
            }
        });
        
        // Login/Register modal switches
        if (DOM.switchToLogin) {
            DOM.switchToLogin.addEventListener('click', (e) => {
                e.preventDefault();
                ModalManager.closeActiveModal();
                setTimeout(() => ModalManager.open(DOM.loginModal), 300);
            });
        }
        
        if (DOM.switchToRegister) {
            DOM.switchToRegister.addEventListener('click', (e) => {
                e.preventDefault();
                ModalManager.closeActiveModal();
                setTimeout(() => ModalManager.open(DOM.registerModal), 300);
            });
        }
        
        // Open modals from buttons
        if (DOM.loginBtn) {
            DOM.loginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                ModalManager.open(DOM.loginModal);
            });
        }
        
        if (DOM.registerBtn) {
            DOM.registerBtn.addEventListener('click', (e) => {
                e.preventDefault();
                ModalManager.open(DOM.registerModal);
            });
        }
        
        // Close modal when clicking outside on mobile
        if (APP_STATE.isMobile) {
            document.addEventListener('click', (e) => {
                if (APP_STATE.modalStack.length > 0 && 
                    e.target.classList.contains('modal') && 
                    !e.target.closest('.modal-content')) {
                    ModalManager.closeActiveModal();
                }
            });
        }
    },
    
    open: (modal) => {
        if (!modal) return;
        
        // Close mobile menu if open
        Navigation.closeMobileMenu();
        
        // Add to stack
        APP_STATE.modalStack.push(modal);
        
        // Show modal
        modal.classList.add('active');
        Utils.preventScroll(true);
        
        // Focus first input
        const firstInput = modal.querySelector('input, textarea, button');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
        
        // Add bottom padding for mobile keyboard
        if (APP_STATE.isMobile) {
            document.body.style.paddingBottom = '300px';
        }
    },
    
    closeActiveModal: () => {
        if (APP_STATE.modalStack.length === 0) return;
        
        const modal = APP_STATE.modalStack.pop();
        modal.classList.remove('active');
        
        // Remove mobile keyboard padding
        if (APP_STATE.isMobile) {
            document.body.style.paddingBottom = '';
        }
        
        // If no more modals, restore scroll
        if (APP_STATE.modalStack.length === 0) {
            Utils.preventScroll(false);
        }
    },
    
    closeAllModals: () => {
        while (APP_STATE.modalStack.length > 0) {
            const modal = APP_STATE.modalStack.pop();
            modal.classList.remove('active');
        }
        Utils.preventScroll(false);
        
        if (APP_STATE.isMobile) {
            document.body.style.paddingBottom = '';
        }
    }
};

// ============================================
// FORM VALIDATION & HANDLING (MOBILE OPTIMIZED)
// ============================================

const FormManager = {
    init: () => {
        // Login form
        if (DOM.loginForm) {
            DOM.loginForm.addEventListener('submit', FormManager.handleLogin);
            FormManager.setupInputValidation(DOM.loginForm);
        }
        
        // Register form
        if (DOM.registerForm) {
            DOM.registerForm.addEventListener('submit', FormManager.handleRegister);
            FormManager.setupInputValidation(DOM.registerForm);
        }
        
        // Contact form
        if (DOM.contactForm) {
            DOM.contactForm.addEventListener('submit', FormManager.handleContact);
            FormManager.setupInputValidation(DOM.contactForm);
        }
        
        // Newsletter form
        if (DOM.newsletterForm) {
            DOM.newsletterForm.addEventListener('submit', FormManager.handleNewsletter);
        }
        
        // Improve form UX on mobile
        if (APP_STATE.isMobile) {
            FormManager.optimizeForMobile();
        }
    },
    
    setupInputValidation: (form) => {
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        
        inputs.forEach(input => {
            // Real-time validation
            input.addEventListener('input', () => {
                FormManager.validateInput(input);
            });
            
            // Blur validation
            input.addEventListener('blur', () => {
                FormManager.validateInput(input);
            });
            
            // Better focus on mobile
            if (APP_STATE.isMobile) {
                input.addEventListener('focus', () => {
                    input.scrollIntoView({ behavior: 'smooth', block: 'center' });
                });
            }
        });
    },
    
    validateInput: (input) => {
        const errorElement = document.getElementById(`${input.id}Error`);
        if (!errorElement) return true;
        
        let isValid = true;
        let errorMessage = '';
        
        // Clear previous error
        errorElement.textContent = '';
        errorElement.classList.remove('active');
        input.classList.remove('error');
        
        // Required validation
        if (!input.value.trim()) {
            isValid = false;
            errorMessage = 'This field is required';
        }
        
        // Email validation
        if (input.type === 'email' && input.value.trim()) {
            if (!Utils.isValidEmail(input.value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email';
            }
        }
        
        // Password validation
        if (input.type === 'password' && input.value.trim()) {
            if (!Utils.isValidPassword(input.value)) {
                isValid = false;
                errorMessage = 'Password must be at least 8 characters';
            }
        }
        
        // Confirm password validation
        if (input.id === 'registerConfirm' && input.value.trim()) {
            const password = document.getElementById('registerPassword');
            if (password && password.value !== input.value) {
                isValid = false;
                errorMessage = 'Passwords do not match';
            }
        }
        
        // Show error if invalid
        if (!isValid) {
            errorElement.textContent = errorMessage;
            errorElement.classList.add('active');
            input.classList.add('error');
            
            // Scroll to error on mobile
            if (APP_STATE.isMobile) {
                setTimeout(() => {
                    errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 100);
            }
        }
        
        return isValid;
    },
    
    validateForm: (form) => {
        let isValid = true;
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        
        inputs.forEach(input => {
            if (!FormManager.validateInput(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    },
    
    handleLogin: (e) => {
        e.preventDefault();
        
        if (!FormManager.validateForm(DOM.loginForm)) {
            return;
        }
        
        const email = document.getElementById('loginEmail')?.value;
        const password = document.getElementById('loginPassword')?.value;
        
        if (!email || !password) return;
        
        Utils.showLoading();
        
        setTimeout(() => {
            Utils.hideLoading();
            
            APP_STATE.isLoggedIn = true;
            APP_STATE.currentUser = { name: 'Demo User', email };
            
            NotificationManager.showToast('Successfully logged in!');
            ModalManager.closeActiveModal();
            FormManager.updateAuthUI();
            
        }, 1500);
    },
    
    handleRegister: (e) => {
        e.preventDefault();
        
        if (!FormManager.validateForm(DOM.registerForm)) {
            return;
        }
        
        const name = document.getElementById('registerName')?.value;
        const email = document.getElementById('registerEmail')?.value;
        const password = document.getElementById('registerPassword')?.value;
        
        if (!name || !email || !password) return;
        
        Utils.showLoading();
        
        setTimeout(() => {
            Utils.hideLoading();
            
            APP_STATE.isLoggedIn = true;
            APP_STATE.currentUser = { name, email };
            
            NotificationManager.showToast('Account created!');
            ModalManager.closeActiveModal();
            FormManager.updateAuthUI();
            
        }, 1500);
    },
    
    handleContact: (e) => {
        e.preventDefault();
        
        if (!FormManager.validateForm(DOM.contactForm)) {
            return;
        }
        
        Utils.showLoading();
        
        setTimeout(() => {
            Utils.hideLoading();
            
            const messageElement = document.getElementById('contactMessageStatus');
            if (messageElement) {
                messageElement.textContent = 'Message sent successfully!';
                messageElement.className = 'form-message success';
            }
            
            if (DOM.contactForm) {
                DOM.contactForm.reset();
            }
            
            setTimeout(() => {
                if (messageElement) {
                    messageElement.textContent = '';
                    messageElement.className = 'form-message';
                }
            }, 5000);
            
        }, 1500);
    },
    
    handleNewsletter: (e) => {
        e.preventDefault();
        
        const emailInput = DOM.newsletterForm?.querySelector('input[type="email"]');
        const messageElement = document.getElementById('newsletterMessage');
        
        if (!emailInput || !messageElement) return;
        
        if (!emailInput.value || !Utils.isValidEmail(emailInput.value)) {
            messageElement.textContent = 'Please enter a valid email';
            messageElement.className = 'form-message error';
            return;
        }
        
        messageElement.textContent = 'Subscribing...';
        messageElement.className = 'form-message';
        
        setTimeout(() => {
            messageElement.textContent = 'Thank you for subscribing!';
            messageElement.className = 'form-message success';
            
            if (DOM.newsletterForm) {
                DOM.newsletterForm.reset();
            }
            
            setTimeout(() => {
                messageElement.textContent = '';
                messageElement.className = 'form-message';
            }, 5000);
        }, 1000);
    },
    
    optimizeForMobile: () => {
        // Change input type to improve mobile keyboard
        document.querySelectorAll('input[type="email"]').forEach(input => {
            input.setAttribute('autocapitalize', 'none');
            input.setAttribute('autocomplete', 'email');
        });
        
        document.querySelectorAll('input[type="password"]').forEach(input => {
            input.setAttribute('autocomplete', 'current-password');
        });
        
        // Add touch-friendly submit buttons
        document.querySelectorAll('button[type="submit"]').forEach(button => {
            button.style.minHeight = '44px';
            button.style.minWidth = '44px';
        });
    },
    
    updateAuthUI: () => {
        if (APP_STATE.isLoggedIn && DOM.loginBtn && DOM.registerBtn) {
            DOM.loginBtn.textContent = 'Dashboard';
            DOM.loginBtn.href = '#dashboard';
            DOM.loginBtn.onclick = (e) => {
                e.preventDefault();
                ModalManager.open(DOM.dashboardModal);
            };
            
            DOM.registerBtn.textContent = 'Logout';
            DOM.registerBtn.classList.remove('btn-primary');
            DOM.registerBtn.classList.add('btn-outline');
            DOM.registerBtn.onclick = (e) => {
                e.preventDefault();
                FormManager.handleLogout();
            };
        }
    },
    
    handleLogout: () => {
        APP_STATE.isLoggedIn = false;
        APP_STATE.currentUser = null;
        
        if (DOM.loginBtn && DOM.registerBtn) {
            DOM.loginBtn.textContent = 'Login';
            DOM.loginBtn.href = '#login';
            DOM.loginBtn.onclick = (e) => {
                e.preventDefault();
                ModalManager.open(DOM.loginModal);
            };
            
            DOM.registerBtn.textContent = 'Sign Up';
            DOM.registerBtn.classList.remove('btn-outline');
            DOM.registerBtn.classList.add('btn-primary');
            DOM.registerBtn.onclick = (e) => {
                e.preventDefault();
                ModalManager.open(DOM.registerModal);
            };
        }
        
        NotificationManager.showToast('Logged out');
    }
};

// ============================================
// FAQ ACCORDION (MOBILE OPTIMIZED)
// ============================================

const FAQManager = {
    init: () => {
        if (!DOM.faqQuestions) return;
        
        DOM.faqQuestions.forEach(question => {
            question.addEventListener('click', FAQManager.toggleQuestion);
            
            // Add keyboard support
            question.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    FAQManager.toggleQuestion(e);
                }
            });
            
            // Better touch target on mobile
            if (APP_STATE.isMobile) {
                question.style.minHeight = '44px';
                question.style.padding = '12px 16px';
            }
        });
    },
    
    toggleQuestion: (e) => {
        const question = e.currentTarget;
        const isExpanded = question.getAttribute('aria-expanded') === 'true';
        
        // On mobile, close other questions when opening a new one
        if (APP_STATE.isMobile && !isExpanded) {
            DOM.faqQuestions.forEach(q => {
                if (q !== question) {
                    q.setAttribute('aria-expanded', 'false');
                    const answerId = q.getAttribute('aria-controls');
                    const answer = document.getElementById(answerId);
                    if (answer) {
                        answer.style.maxHeight = '0';
                    }
                }
            });
        }
        
        const newExpandedState = !isExpanded;
        question.setAttribute('aria-expanded', newExpandedState);
        
        const answerId = question.getAttribute('aria-controls');
        const answer = document.getElementById(answerId);
        
        if (answer) {
            if (newExpandedState) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
                
                // Scroll into view on mobile
                if (APP_STATE.isMobile) {
                    setTimeout(() => {
                        question.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }, 100);
                }
            } else {
                answer.style.maxHeight = '0';
            }
        }
    }
};

// ============================================
// NOTIFICATION SYSTEM (MOBILE OPTIMIZED)
// ============================================

const NotificationManager = {
    init: () => {
        if (!DOM.toast || !DOM.toastClose) return;
        
        DOM.toastClose.addEventListener('click', NotificationManager.hideToast);
        
        // Auto-hide toast
        setInterval(() => {
            if (DOM.toast.classList.contains('show')) {
                NotificationManager.hideToast();
            }
        }, 5000);
        
        // Better positioning on mobile
        if (APP_STATE.isMobile) {
            DOM.toast.style.bottom = '80px';
            DOM.toast.style.left = '16px';
            DOM.toast.style.right = '16px';
            DOM.toast.style.width = 'auto';
            DOM.toast.style.transform = 'translateX(0)';
        }
    },
    
    showToast: (message) => {
        if (!DOM.toast) return;
        
        const toastMessage = DOM.toast.querySelector('.toast-message');
        if (toastMessage) {
            toastMessage.textContent = message;
        }
        
        DOM.toast.classList.add('show');
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            NotificationManager.hideToast();
        }, 5000);
    },
    
    hideToast: () => {
        if (!DOM.toast) return;
        DOM.toast.classList.remove('show');
    }
};

// ============================================
// UI ENHANCEMENTS & ANIMATIONS (MOBILE OPTIMIZED)
// ============================================

const UIEnhancements = {
    init: () => {
        // Back to top button
        if (DOM.backToTop) {
            DOM.backToTop.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
            
            // Better touch target on mobile
            if (APP_STATE.isMobile) {
                DOM.backToTop.style.width = '56px';
                DOM.backToTop.style.height = '56px';
                DOM.backToTop.style.fontSize = '20px';
            }
        }
        
        // Announcement close
        if (DOM.announcementClose) {
            DOM.announcementClose.addEventListener('click', () => {
                if (DOM.announcementBar) {
                    DOM.announcementBar.style.display = 'none';
                }
            });
        }
        
        // Chat widget
        if (DOM.chatWidget) {
            DOM.chatWidget.addEventListener('click', () => {
                NotificationManager.showToast('Live chat would open here');
            });
            
            // Better positioning on mobile
            if (APP_STATE.isMobile) {
                DOM.chatWidget.style.bottom = '140px';
                DOM.chatWidget.style.right = '20px';
                DOM.chatWidget.style.width = '56px';
                DOM.chatWidget.style.height = '56px';
            }
        }
        
        // Theme toggle positioning on mobile
        if (APP_STATE.isMobile && DOM.themeToggle) {
            DOM.themeToggle.style.bottom = '80px';
            DOM.themeToggle.style.right = '20px';
            DOM.themeToggle.style.width = '56px';
            DOM.themeToggle.style.height = '56px';
        }
        
        // Initialize lazy loading
        UIEnhancements.initLazyLoading();
        
        // Initialize scroll animations
        UIEnhancements.initScrollAnimations();
        
        // Improve touch experience
        UIEnhancements.enhanceTouchUX();
    },
    
    initLazyLoading: () => {
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                        imageObserver.unobserve(img);
                    }
                });
            }, {
                rootMargin: APP_STATE.isMobile ? '50px' : '100px'
            });
            
            lazyImages.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for older browsers
            lazyImages.forEach(img => {
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                }
            });
        }
    },
    
    initScrollAnimations: () => {
        const animatedElements = document.querySelectorAll('.feature-card, .course-card, .testimonial-card');
        
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: APP_STATE.isMobile ? 0.05 : 0.1,
                rootMargin: '0px 0px -50px 0px'
            });
            
            animatedElements.forEach(el => observer.observe(el));
        } else {
            // Fallback - show all immediately
            animatedElements.forEach(el => el.classList.add('animate-in'));
        }
    },
    
    enhanceTouchUX: () => {
        if (!Utils.isTouchDevice()) return;
        
        // Improve button touch targets
        document.querySelectorAll('.btn, .btn-icon, .filter-tab, .category-filter').forEach(button => {
            button.style.minHeight = '44px';
            button.style.minWidth = '44px';
            button.style.touchAction = 'manipulation';
        });
        
        // Prevent text selection on interactive elements
        document.querySelectorAll('.btn, .nav-link, .filter-tab, .category-filter').forEach(el => {
            el.style.webkitUserSelect = 'none';
            el.style.userSelect = 'none';
        });
        
        // Add touch feedback
        document.addEventListener('touchstart', () => {}, { passive: true });
        
        // Improve scrolling
        document.documentElement.style.scrollBehavior = 'smooth';
    }
};

// ============================================
// RESIZE HANDLER
// ============================================

const ResizeHandler = {
    init: () => {
        window.addEventListener('resize', Utils.debounce(ResizeHandler.handleResize, 250));
    },
    
    handleResize: () => {
        const wasMobile = APP_STATE.isMobile;
        const wasTablet = APP_STATE.isTablet;
        
        APP_STATE.isMobile = window.innerWidth <= 768;
        APP_STATE.isTablet = window.innerWidth <= 1024 && window.innerWidth > 768;
        
        // Update UI if screen size category changed
        if (wasMobile !== APP_STATE.isMobile || wasTablet !== APP_STATE.isTablet) {
            // Update modal positions
            if (APP_STATE.isMobile) {
                // Adjust for mobile
                if (DOM.toast) {
                    DOM.toast.style.bottom = '80px';
                    DOM.toast.style.left = '16px';
                    DOM.toast.style.right = '16px';
                }
                if (DOM.chatWidget) {
                    DOM.chatWidget.style.bottom = '140px';
                }
                if (DOM.themeToggle) {
                    DOM.themeToggle.style.bottom = '80px';
                }
            } else {
                // Reset to desktop
                if (DOM.toast) {
                    DOM.toast.style.bottom = '24px';
                    DOM.toast.style.left = '50%';
                    DOM.toast.style.right = 'auto';
                }
                if (DOM.chatWidget) {
                    DOM.chatWidget.style.bottom = '96px';
                }
                if (DOM.themeToggle) {
                    DOM.themeToggle.style.bottom = '24px';
                }
            }
            
            // Update teacher slider arrows
            if (DOM.sliderPrev && DOM.sliderNext) {
                if (APP_STATE.isMobile && DATA_STORE.teachers.length <= 2) {
                    DOM.sliderPrev.style.display = 'none';
                    DOM.sliderNext.style.display = 'none';
                } else {
                    DOM.sliderPrev.style.display = 'flex';
                    DOM.sliderNext.style.display = 'flex';
                }
            }
        }
    }
};

// ============================================
// INITIALIZATION
// ============================================

const App = {
    init: () => {
        console.log('Initializing Frontend Academy (Mobile Optimized)...');
        
        // Initialize DOM elements first
        DOMInitializer.init();
        
        // Check if critical elements exist
        if (!DOM.body) {
            console.error('DOM body not found!');
            return;
        }
        
        // Initialize all modules
        ResizeHandler.init();
        ThemeManager.init();
        Navigation.init();
        
        // Initialize search if elements exist
        if (DOM.searchBtn && DOM.searchOverlay) {
            Search.init();
        }
        
        ModalManager.init();
        CourseManager.init();
        TeachersSlider.init();
        
        if (DOM.blogGrid) {
            BlogManager.init();
        }
        
        FAQManager.init();
        FormManager.init();
        
        if (DOM.dashboardTabs.length > 0) {
            DashboardManager.init();
        }
        
        NotificationManager.init();
        UIEnhancements.init();
        
        // Load initial data
        App.loadInitialData();
        
        // Simulate loading completion
        setTimeout(() => {
            Utils.hideLoading();
            
            // Welcome notification
            setTimeout(() => {
                NotificationManager.showToast('Welcome to Frontend Academy!');
            }, 1000);
            
        }, 2000);
    },
    
    loadInitialData: () => {
        console.log('Loading initial data...');
        
        // Check for saved user
        try {
            const savedUser = localStorage.getItem('frontendAcademyUser');
            if (savedUser) {
                APP_STATE.isLoggedIn = true;
                APP_STATE.currentUser = JSON.parse(savedUser);
                FormManager.updateAuthUI();
            }
        } catch (e) {
            console.log('No saved user found');
        }
    }
};

// ============================================
// SEARCH FUNCTIONALITY
// ============================================

const Search = {
    init: () => {
        if (!DOM.searchBtn || !DOM.searchOverlay || !DOM.searchClose) return;
        
        DOM.searchBtn.addEventListener('click', Search.open);
        DOM.searchClose.addEventListener('click', Search.close);
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && DOM.searchOverlay.classList.contains('active')) {
                Search.close();
            }
        });
        
        if (DOM.searchInput) {
            DOM.searchInput.addEventListener('input', Utils.debounce(Search.performSearch, 300));
            
            // Handle mobile keyboard
            if (APP_STATE.isMobile) {
                DOM.searchInput.addEventListener('focus', () => {
                    setTimeout(() => {
                        DOM.searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 300);
                });
            }
        }
    },
    
    open: () => {
        if (!DOM.searchOverlay) return;
        
        DOM.searchOverlay.classList.add('active');
        Utils.preventScroll(true);
        
        if (DOM.searchInput) {
            setTimeout(() => {
                DOM.searchInput.focus();
                
                // Open virtual keyboard on mobile
                if (APP_STATE.isMobile) {
                    DOM.searchInput.click();
                }
            }, 100);
        }
    },
    
    close: () => {
        if (!DOM.searchOverlay) return;
        
        DOM.searchOverlay.classList.remove('active');
        Utils.preventScroll(false);
        
        if (DOM.searchInput) {
            DOM.searchInput.value = '';
        }
    },
    
    performSearch: (e) => {
        const query = e.target.value.toLowerCase();
        
        if (query.length > 2) {
            // In a real app, this would filter courses
            console.log('Searching for:', query);
        }
    }
};

// ============================================
// BLOG MANAGEMENT
// ============================================

const BlogManager = {
    init: () => {
        DATA_STORE.blogPosts = DataGenerator.generateBlogPosts();
        
        if (DOM.blogGrid) {
            BlogManager.renderBlogPosts();
        }
    },
    
    renderBlogPosts: () => {
        DOM.blogGrid.innerHTML = '';
        
        DATA_STORE.blogPosts.forEach((post, index) => {
            const blogCard = BlogManager.createBlogCard(post);
            DOM.blogGrid.appendChild(blogCard);
            
            setTimeout(() => {
                Utils.fadeIn(blogCard);
            }, 100 * index);
        });
    },
    
    createBlogCard: (post) => {
        const card = document.createElement('article');
        card.className = 'blog-post card';
        
        card.innerHTML = `
            <div class="blog-post-image">
                <img src="${post.image}" alt="${post.title}">
            </div>
            <div class="blog-post-content">
                <span class="blog-post-date">
                    <i class="far fa-calendar"></i> ${Utils.formatDate(post.date)}
                </span>
                <h3 class="blog-post-title">${post.title}</h3>
                <p class="blog-post-excerpt">${post.excerpt}</p>
                <div class="blog-post-meta">
                    <span class="blog-post-category">${post.category}</span>
                    <span class="blog-post-read-time">
                        <i class="far fa-clock"></i> ${post.readTime} read
                    </span>
                </div>
            </div>
        `;
        
        card.addEventListener('click', () => {
            BlogManager.showBlogPost(post.id);
        });
        
        return card;
    },
    
    showBlogPost: (postId) => {
        const post = DATA_STORE.blogPosts.find(p => p.id === postId);
        if (!post || !DOM.courseModal) return;
        
        const modalContent = document.getElementById('courseModalContent');
        if (!modalContent) return;
        
        modalContent.innerHTML = `
            <div class="blog-detail">
                <div class="blog-detail-header">
                    <span class="blog-detail-category">${post.category}</span>
                    <h2>${post.title}</h2>
                    <div class="blog-detail-meta">
                        <span><i class="far fa-calendar"></i> ${Utils.formatDate(post.date)}</span>
                        <span><i class="far fa-user"></i> ${post.author}</span>
                        <span><i class="far fa-clock"></i> ${post.readTime} read</span>
                    </div>
                </div>
                
                <div class="blog-detail-content">
                    <p>${post.excerpt}</p>
                    <p>This is a detailed blog post about ${post.category}. In a real application, this would contain the full article content.</p>
                </div>
            </div>
        `;
        
        ModalManager.open(DOM.courseModal);
    }
};

// ============================================
// DASHBOARD MANAGEMENT
// ============================================

const DashboardManager = {
    init: () => {
        if (!DOM.dashboardTabs || DOM.dashboardTabs.length === 0) return;
        
        DOM.dashboardTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabId = tab.dataset.tab;
                DashboardManager.switchTab(tabId);
            });
        });
    },
    
    switchTab: (tabId) => {
        DOM.dashboardTabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabId);
        });
        
        DOM.dashboardPanels.forEach(panel => {
            panel.classList.toggle('active', panel.id === `${tabId}Panel`);
        });
    }
};

// ============================================
// EVENT LISTENERS & STARTUP
// ============================================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('Page is hidden');
    }
});

// Handle window resize
window.addEventListener('resize', Utils.debounce(() => {
    // Update slider position on resize
    if (TeachersSlider.goToSlide) {
        TeachersSlider.goToSlide(APP_STATE.currentTeacherSlide);
    }
}, 250));

// Global error handling
window.addEventListener('error', (e) => {
    console.error('Error:', e.error);
});

// ============================================
// DEMO UTILITIES
// ============================================

window.demo = {
    login: () => {
        APP_STATE.isLoggedIn = true;
        APP_STATE.currentUser = { name: 'Demo User', email: 'demo@example.com' };
        FormManager.updateAuthUI();
        NotificationManager.showToast('Demo login successful!');
    },
    
    logout: () => {
        FormManager.handleLogout();
    },
    
    showHTMLCourses: () => {
        const button = document.querySelector('.category-filter[data-category="html"]');
        if (button) button.click();
    },
    
    showCSSCourses: () => {
        const button = document.querySelector('.category-filter[data-category="css"]');
        if (button) button.click();
    },
    
    showJSCourses: () => {
        const button = document.querySelector('.category-filter[data-category="javascript"]');
        if (button) button.click();
    },
    
    showReactCourses: () => {
        const button = document.querySelector('.category-filter[data-category="react"]');
        if (button) button.click();
    },
    
    showVueCourses: () => {
        const button = document.querySelector('.category-filter[data-category="vue"]');
        if (button) button.click();
    },
    
    toggleTheme: () => {
        ThemeManager.toggle();
    },
    
    testToast: () => {
        NotificationManager.showToast('Test notification from console');
    }
};