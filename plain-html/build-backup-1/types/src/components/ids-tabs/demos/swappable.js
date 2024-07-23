import '../../ids-swappable/ids-swappable';
import '../../ids-swappable/ids-swappable-item';
document.addEventListener('DOMContentLoaded', () => {
    const tabElements = [...document.querySelectorAll('ids-tabs')];
    tabElements.forEach((el) => el.addEventListener('change', (e) => {
        console.info(`ids-tabs.on('change') =>`, e.target?.value);
    }));
});
//# sourceMappingURL=swappable.js.map