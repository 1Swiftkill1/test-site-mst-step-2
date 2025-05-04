document.addEventListener('DOMContentLoaded', () => {
    const sourceVideo = document.getElementById('source-video');
    const textFlow = document.getElementById('textFlow');
    const originalHTML = textFlow.innerHTML; 
    
    let videoElements = []; 

    function createVideoBox(className, videoIndex) {
        const span = document.createElement('span');
        span.className = `video-box ${className} mobile`;
        const video = document.createElement('video');
        video.src = 'video.mp4';
        video.loop = true;
        video.muted = true;
        video.playsInline = true;
        video.classList.add(`video-${videoIndex}`);
        span.appendChild(video);
        videoElements.push(video); 
        return span;
    }

    function syncVideo(video) {
        video.currentTime = sourceVideo.currentTime;
        video.play();
        sourceVideo.addEventListener('play', () => {
            video.currentTime = sourceVideo.currentTime;
            video.play();
        });
    }

    function setupMobileLayout() {
        textFlow.innerHTML = originalHTML; 
        const allowedKeywords = ["We're here", 'to', 'make', 'can', 'happier'];

        allowedKeywords.forEach((keyword, index) => {
            const nodes = Array.from(textFlow.childNodes);
            const nodeIndex = nodes.findIndex(n => n.nodeType === 3 && n.textContent.includes(keyword));

            if (nodeIndex !== -1) {
                const node = nodes[nodeIndex];
                const parts = node.textContent.split(keyword);
                const before = document.createTextNode(parts[0] + keyword + ' ');
                const after = document.createTextNode(parts[1]);

                const videoBox = createVideoBox(`video-${index + 1}`, index + 1);
                textFlow.replaceChild(after, node);
                textFlow.insertBefore(videoBox, after);
                textFlow.insertBefore(before, videoBox);

                syncVideo(videoBox.querySelector('video'));
            }
        });

        const finalVideoBox = createVideoBox('video-4', 4);
        textFlow.appendChild(finalVideoBox);
        syncVideo(finalVideoBox.querySelector('video'));

        document.querySelectorAll('.video-box.original').forEach(box => box.remove());
    }

    function setupDesktopLayout() {
        textFlow.innerHTML = originalHTML; 

        document.querySelectorAll('.video-box.original').forEach(box => {
            const video = document.createElement('video');
            video.src = 'video.mp4';
            video.loop = true;
            video.muted = true;
            video.playsInline = true;
            box.appendChild(video);
            syncVideo(video);
        });
    }

    function handleResize() {
        const isMobile = window.innerWidth <= 768;

        if (isMobile) {
            setupMobileLayout();
        } else {
            setupDesktopLayout();
        }
    }

    sourceVideo.play().catch(e => console.log("Autoplay prevented:", e));
    handleResize(); 
    window.addEventListener('resize', () => {

        clearTimeout(window.resizeTimeout);
        window.resizeTimeout = setTimeout(handleResize, 100);
    });
});