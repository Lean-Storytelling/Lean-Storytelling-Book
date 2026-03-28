// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded affix "><a href="0-intro.html">So you want to go on an journey?</a></li><li class="chapter-item expanded affix "><li class="part-title">Departure to the storytelling adventure</li><li class="chapter-item expanded "><a href="0-lean-storytelling/0-lean-storytelling.html"><strong aria-hidden="true">1.</strong> Lean Storytelling</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="0-lean-storytelling/1-transformation.html"><strong aria-hidden="true">1.1.</strong> Transformation of a hero</a></li><li class="chapter-item expanded "><a href="0-lean-storytelling/2-cycles.html"><strong aria-hidden="true">1.2.</strong> Cycles, movements, and waves</a></li></ol></li><li class="chapter-item expanded "><li class="part-title">Into the abyss of storytelling</li><li class="chapter-item expanded "><a href="1-build/0-build.html"><strong aria-hidden="true">2.</strong> Build you Story</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="1-build/1-basic.html"><strong aria-hidden="true">2.1.</strong> Basic Story</a></li><li class="chapter-item expanded "><a href="1-build/2-detailed.html"><strong aria-hidden="true">2.2.</strong> Detailed Story</a></li><li class="chapter-item expanded "><a href="1-build/3-full.html"><strong aria-hidden="true">2.3.</strong> Full Story</a></li></ol></li><li class="chapter-item expanded "><a href="2-extend/0-extend.html"><strong aria-hidden="true">3.</strong> Extend your Story</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="2-extend/1-addons.html"><strong aria-hidden="true">3.1.</strong> Addons</a></li><li class="chapter-item expanded "><a href="2-extend/2-complex.html"><strong aria-hidden="true">3.2.</strong> Complex</a></li></ol></li><li class="chapter-item expanded "><a href="3-deliver/0-deliver.html"><strong aria-hidden="true">4.</strong> Deliver your Story</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="3-deliver/1-audience.html"><strong aria-hidden="true">4.1.</strong> Audience</a></li><li class="chapter-item expanded "><a href="3-deliver/2-format.html"><strong aria-hidden="true">4.2.</strong> Format</a></li></ol></li><li class="chapter-item expanded "><li class="part-title">The return as a master storyteller</li><li class="chapter-item expanded "><a href="4-beyond/0-beyond.html"><strong aria-hidden="true">5.</strong> Beyond storytelling</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="4-beyond/1-invent.html"><strong aria-hidden="true">5.1.</strong> Invent</a></li><li class="chapter-item expanded "><a href="4-beyond/2-explore.html"><strong aria-hidden="true">5.2.</strong> Explore</a></li></ol></li><li class="chapter-item expanded "><a href="5-outro.html">Around the firecamp</a></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString().split("#")[0].split("?")[0];
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);
