document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.getElementById('main-content');
    
    sections.forEach((section, index) => {
        const sectionEl = document.createElement('section');
        sectionEl.className = 'section';
        sectionEl.style.setProperty('--index', index);
        
        const titleEl = document.createElement('h2');
        titleEl.textContent = section.title;
        sectionEl.appendChild(titleEl);
        
        const gridEl = document.createElement('div');
        gridEl.className = 'links-grid';
        
        section.links.forEach(link => {
            const cardEl = document.createElement('a');
            cardEl.href = link.url;
            cardEl.target = '_blank';
            cardEl.className = 'link-card';
            
            const contentEl = document.createElement('div');
            contentEl.className = 'link-card-content';
            
            const emojiEl = document.createElement('span');
            emojiEl.className = 'emoji';
            emojiEl.textContent = link.emoji;
            
            const titleSpanEl = document.createElement('span');
            titleSpanEl.className = 'title';
            titleSpanEl.textContent = link.title;
            
            contentEl.appendChild(emojiEl);
            contentEl.appendChild(titleSpanEl);
            cardEl.appendChild(contentEl);
            gridEl.appendChild(cardEl);
        });
        
        sectionEl.appendChild(gridEl);
        mainContent.appendChild(sectionEl);
    });

    // Smooth scroll para links de navegação
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});
