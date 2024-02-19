
let isAnimating = false;
let pullDeltax = 0;
const DECISION_THRESHOLD = 80;

function startDrag(event) {
    if (isAnimating) return;

    const actualCard = event.target.closest('article')

    const startX = event.pageX ?? event.touches[0].pageX;

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onEnd);

    document.addEventListener('touchmove', onMove, { passive: true });
    document.addEventListener('touchend', onEnd, { passive: true });


    function onMove(event) {
        //current position
        const currentX = event.pageX ?? event.touches[0].pageX;
        pullDeltax = currentX - startX;

        if (pullDeltax === 0) return;

        const deg = pullDeltax / 14;

        actualCard.style.transform = `translateX(${pullDeltax}px) rotate(${deg}deg)`;
        actualCard.style.cursor = 'grabbing';

        const opacity = Math.abs(pullDeltax) / 100;
        const isRight = pullDeltax > 0;
        const choiseEl = isRight
            ? actualCard.querySelector('.choice.like')
            : actualCard.querySelector('.choice.nope');
        choiseEl.style.opacity = opacity;
    }

    function onEnd(event) {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onEnd);

        document.removeEventListener('touchmove', onMove);
        document.removeEventListener('touchend', onEnd);

        //saber si el usuario tomo una desicion

        const decisionMade = Math.abs(pullDeltax) >= DECISION_THRESHOLD;
        if (decisionMade) {
            const goRigth = pullDeltax >= 0;
            const goLeft = !goRigth;

            actualCard.classList.add(goRigth ? 'go-right' : 'go-left');
            actualCard.addEventListener('transitionend', () => {
                actualCard.remove();
            }, { once: true });
        } else {
            actualCard.classList.add('reset');
            actualCard.classList.remove('go-right', 'go-left');
        }

        actualCard.addEventListener('transitionend', () => {
            actualCard.removeAttribute('style');
            actualCard.classList.remove('reset');
            pullDeltax = 0;
            isAnimating = false;
        })
    }
}


document.addEventListener('mousedown', startDrag);
document.addEventListener('touchstart', startDrag, { passive: true });
