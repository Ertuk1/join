let currentDraggedElement = null;
let initialX = null;
let initialY = null;
let isDragging = false;
let dragClone = null;

document.addEventListener('DOMContentLoaded', () => {
    // Select all .taskContent elements
    const scrollContainers = document.querySelectorAll('.taskContent');

    // Adjust these values to control the scrolling speed and sensitivity
    const scrollSpeed = 5; // Higher value means faster scrolling
    const scrollMargin = 0.3; // Portion of the container width to trigger scrolling (e.g., 0.2 means 20% from edges)

    scrollContainers.forEach(container => {
        container.addEventListener('mousemove', (event) => {
            // Get the container's dimensions and position
            const rect = container.getBoundingClientRect();
            const containerWidth = rect.width;
            const containerLeft = rect.left;

            // Calculate mouse position relative to the container
            const mouseX = event.clientX - containerLeft;

            // Calculate the margins for scrolling
            const leftMargin = containerWidth * scrollMargin;
            const rightMargin = containerWidth * (1 - scrollMargin);

            if (mouseX < leftMargin) {
                // Mouse is within the left margin, scroll left
                container.scrollLeft -= scrollSpeed * (leftMargin - mouseX) / leftMargin;
            } else if (mouseX > rightMargin) {
                // Mouse is within the right margin, scroll right
                container.scrollLeft += scrollSpeed * (mouseX - rightMargin) / (containerWidth - rightMargin);
            }
        });
    });
});


function stopPropagation(event) {
    event.stopPropagation();
}
// Function to handle the dragging start
function startDragging(taskId) {
    currentDraggedElement = taskId;
}

// Function to allow dropping by preventing the default behavior
function allowDrop(event) {
    event.preventDefault();
}

// Function to handle dropping
async function drop(event) {
    event.preventDefault(); // Prevent default drop behavior

    let dropZone = event.target.closest('.taskContent'); // Identify the drop zone
    if (!dropZone) return;

    let taskElement = document.querySelector(`[data-id="${currentDraggedElement}"]`);
    if (!taskElement) {
        console.error('Task element not found with id:', currentDraggedElement);
        return;
    }

    // Append the task to the drop zone
    dropZone.appendChild(taskElement);

    // Update the task's status based on the drop zone ID
    let newStatus = dropZone.id;
    let task = tasks.find(t => t.id === currentDraggedElement);

    if (task) {
        task.status = newStatus;
        await changeTask(`/task/${currentDraggedElement}/status`, task.status);
        await loadDataTask(); // Reload tasks from backend
        renderTasks(); // Re-render tasks to reflect changes
    } else {
        console.error('Task data not found for id:', currentDraggedElement);
    }
}

async function dropMobile(event) {
  /*   event.preventDefault(); // Prevent default drop behavior */

    // Get touch coordinates
    let touch = event.changedTouches[0];
    let dropZone = document.elementFromPoint(touch.clientX, touch.clientY).closest('.taskContent');

    if (!dropZone) {
        console.error('Drop zone not found');
        return;
    }

    let taskElement = document.querySelector(`[data-id="${currentDraggedElement}"]`);
    if (!taskElement) {
        console.error('Task element not found with id:', currentDraggedElement);
        return;
    }

    // Append the task to the drop zone
    dropZone.appendChild(taskElement);

    // Update the task's status based on the drop zone ID
    let newStatus = dropZone.id;
    let task = tasks.find(t => t.id === currentDraggedElement);

    if (task) {
        task.status = newStatus;
        await changeTask(`/task/${currentDraggedElement}/status`, task.status);
        await loadDataTask(); // Reload tasks from backend
        renderTasks(); // Re-render tasks to reflect changes
    } else {
        console.error('Task data not found for id:', currentDraggedElement);
    }
}


document.addEventListener('touchstart', (event) => {
    const card = event.target.closest('.card');
    if (card) {
        currentDraggedElement = card.dataset.id; // Set the current dragged element
        initialX = event.touches[0].clientX;
        initialY = event.touches[0].clientY;
        isDragging = false; // Reset dragging state

        // Create a visual clone of the dragged element
        dragClone = card.cloneNode(true);
        dragClone.style.position = 'absolute';
        dragClone.style.pointerEvents = 'none';
        document.body.appendChild(dragClone);
    }
}, { passive: true });

document.addEventListener('touchmove', (event) => {
    if (initialX === null || initialY === null) return;

    let currentX = event.touches[0].clientX;
    let currentY = event.touches[0].clientY;

    let diffX = currentX - initialX;
    let diffY = currentY - initialY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
        // Horizontal movement detected, let the user scroll
        isDragging = false;
    } else {
        // Vertical movement detected, start dragging
        event.preventDefault(); // Prevent scrolling
        isDragging = true;

        if (dragClone) {
            // Update the clone's position to follow the touch
            dragClone.style.left = `${currentX}px`;
            dragClone.style.top = `${currentY}px`;
        }
    }
}, { passive: false });

document.addEventListener('touchend', async (event) => {
    if (isDragging) {
        await dropMobile(event);
    }

    // Remove the clone
    if (dragClone) {
        document.body.removeChild(dragClone);
        dragClone = null;
    }

    // Reset initial positions
    initialX = null;
    initialY = null;
    isDragging = false;
}, { passive: true });
