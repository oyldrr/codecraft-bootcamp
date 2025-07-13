
const form = document.getElementById('taskForm');
const taskList = document.getElementById('taskList');
const errorDiv = document.getElementById('error');
const filterBtn = document.getElementById('filterBtn');

let showCompletedOnly = false;

function checkEmptyState() {
    const taskRows = document.querySelectorAll('.task');
    const emptyMessage = document.getElementById('emptyMessage');
    if (taskRows.length === 0) {
        emptyMessage.style.display = 'block';
    } else {
        emptyMessage.style.display = 'none';
    }
}

checkEmptyState();

form.addEventListener('submit', function (e) {
    e.preventDefault();
    errorDiv.classList.remove('show');

    try {
        const title = document.getElementById('title').value.trim();
        const description = document.getElementById('description').value.trim();
        const priority = document.querySelector('input[name="priority"]:checked');

        const priorityValues = {
            low: 'Düşük',
            medium: 'Orta',
            high: 'Yüksek'
        };

        if (!title) {
            errorDiv.classList.add('show');
            errorDiv.innerHTML = '<i class="fa fa-exclamation-triangle" aria-hidden="true"></i> Lütfen bir başlık girin.';
            return;
        }

        if (!priority) {
            errorDiv.classList.add('show');
            errorDiv.innerHTML = '<i class="fa fa-exclamation-triangle" aria-hidden="true"></i> Lütfen bir öncelik seçin.';
            return;
        }

        const task = document.createElement('tr');
        task.className = 'task';
        task.innerHTML = `
          <td><strong>${title}</strong></td>
          <td><small>${description}</small></td>
          <td>${priorityValues[priority.value]}</td>
          <td>
            <button class="completeBtn">
                <i class="fa fa-check" aria-hidden="true"></i>
                Tamamlandı
            </button>
            <button class="deleteBtn">
                <i class="fa fa-trash" aria-hidden="true"></i>
                Sil
            </button>
          </td>
    
        `;
        task.classList.add(priority.value);

        taskList.appendChild(task);
        checkEmptyState();
        form.reset();
    } catch (err) {
        errorDiv.textContent = 'Bir hata oluştu: ' + err.message;
    }
});

taskList.addEventListener('click', function (e) {
    e.stopPropagation();
    const target = e.target;

    if (target.classList.contains('completeBtn')) {
        target.parentElement.parentElement.classList.toggle('completed');
        target.textContent == "Geri al" ? target.textContent = "Tamamlandı" : target.textContent = "Geri al";
    }

    if (target.classList.contains('deleteBtn')) {
        target.parentElement.parentElement.remove();
        checkEmptyState();
    }
});

filterBtn.addEventListener('click', function () {
    showCompletedOnly = !showCompletedOnly;
    const tasks = document.querySelectorAll('.task');

    tasks.forEach(task => {
        if (showCompletedOnly) {
            if (!task.classList.contains('completed')) {
                task.style.display = 'none';
            } else {
                task.style.display = 'table-row';
            }
        } else {
            task.style.display = 'table-row';
        }
    });
});

