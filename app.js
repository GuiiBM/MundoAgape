(() => {
    const ACCENTS = ['sky', 'sun', 'coral', 'leaf', 'grape'];
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // "📌 Links Principais" -> { icon: "📌", label: "Links Principais" }
    const splitTitle = (title) => {
        const match = title.match(/^(\S+)\s+(.+)$/);
        if (match && !/[\p{L}\p{N}]/u.test(match[1])) {
            return { icon: match[1], label: match[2] };
        }
        return { icon: '', label: title };
    };

    const slugify = (text) => text
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const el = (tag, className, text) => {
        const node = document.createElement(tag);
        if (className) node.className = className;
        if (text) node.textContent = text;
        return node;
    };

    const arrowSvg = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17L17 7M9 7h8v8"/></svg>';
    const underlineSvg = '<svg viewBox="0 0 200 14" preserveAspectRatio="none" aria-hidden="true"><path d="M3 9 C 40 3, 80 13, 120 7 S 180 4, 197 8"/></svg>';

    const renderSections = () => {
        const main = document.getElementById('conteudo');
        const quickNav = document.getElementById('quick-nav-list');

        sections.forEach((section, index) => {
            const { icon, label } = splitTitle(section.title);
            const accent = ACCENTS[index % ACCENTS.length];
            const id = slugify(label);

            const sectionEl = el('section', `section accent-${accent} reveal`);
            sectionEl.id = id;
            sectionEl.setAttribute('aria-labelledby', `${id}-title`);

            const head = el('div', 'section-head');
            if (icon) head.appendChild(el('span', 'section-icon', icon));

            const titleWrap = el('div', 'section-title-wrap');
            const h2 = el('h2', 'section-title', label);
            h2.id = `${id}-title`;
            h2.insertAdjacentHTML('beforeend', underlineSvg);
            titleWrap.appendChild(h2);
            head.appendChild(titleWrap);

            const count = section.links.length;
            head.appendChild(el('span', 'section-count', count === 1 ? '1 link' : `${count} links`));
            sectionEl.appendChild(head);

            const grid = el('ul', 'links-grid');
            section.links.forEach((link, i) => {
                const item = el('li');
                item.style.setProperty('--i', i);

                const card = el('a', 'link-card');
                card.href = link.url;
                card.target = '_blank';
                card.rel = 'noopener';

                card.appendChild(el('span', 'link-emoji', link.emoji));
                card.appendChild(el('span', 'link-title', link.title));
                card.insertAdjacentHTML('beforeend', `<span class="link-arrow">${arrowSvg}</span>`);
                card.appendChild(el('span', 'sr-only', '(abre em nova aba)'));

                item.appendChild(card);
                grid.appendChild(item);
            });
            sectionEl.appendChild(grid);
            main.appendChild(sectionEl);

            // Atalho no topo da página
            const navItem = el('li');
            const navLink = el('a', `chip accent-${accent}`);
            navLink.href = `#${id}`;
            if (icon) navLink.appendChild(el('span', 'chip-icon', icon));
            navLink.appendChild(document.createTextNode(label));
            navItem.appendChild(navLink);
            quickNav.appendChild(navItem);
        });
    };

    const setupReveal = () => {
        const items = document.querySelectorAll('.reveal');
        if (reduceMotion || !('IntersectionObserver' in window)) {
            items.forEach((item) => item.classList.add('is-visible'));
            return;
        }
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        items.forEach((item) => observer.observe(item));
    };

    const setupLoader = () => {
        const loader = document.getElementById('loader');
        if (!loader) return;

        let seen = false;
        try { seen = sessionStorage.getItem('mundoagape-loaded') === '1'; } catch (e) { /* sem storage */ }

        const minTime = reduceMotion ? 200 : (seen ? 500 : 1700);
        const start = performance.now();
        let done = false;

        const hide = () => {
            if (done) return;
            done = true;
            const wait = Math.max(0, minTime - (performance.now() - start));
            setTimeout(() => {
                document.documentElement.classList.add('is-loaded');
                loader.addEventListener('transitionend', () => loader.remove(), { once: true });
                setTimeout(() => loader.remove(), 1200);
                try { sessionStorage.setItem('mundoagape-loaded', '1'); } catch (e) { /* sem storage */ }
            }, wait);
        };

        if (document.readyState === 'complete') hide();
        else window.addEventListener('load', hide, { once: true });
        setTimeout(hide, 4500); // nunca prende o visitante numa rede lenta
    };

    document.addEventListener('DOMContentLoaded', () => {
        renderSections();
        setupReveal();

        const year = document.getElementById('year');
        if (year) year.textContent = new Date().getFullYear();
    });

    setupLoader();
})();
