let options = ['选项1', '选项2', '选项3', '选项4', '选项5', '选项6'];
let isSpinning = false;
let currentRotation = 0;

const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
    '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
    '#BB8FCE', '#85C1E9', '#F8B500', '#00CED1'
];

const wheel = document.getElementById('wheel');
const spinBtn = document.getElementById('spinBtn');
const result = document.getElementById('result');
const optionsList = document.getElementById('optionsList');
const newOptionInput = document.getElementById('newOption');
const addOptionBtn = document.getElementById('addOptionBtn');

function createWheel() {
    wheel.innerHTML = '<div class="wheel-pointer"></div>';
    
    if (options.length === 0) {
        result.textContent = '请添加至少一个选项';
        return;
    }

    const segmentAngle = 360 / options.length;
    
    options.forEach((option, index) => {
        const segment = document.createElement('div');
        segment.className = 'wheel-segment';
        segment.style.backgroundColor = colors[index % colors.length];
        segment.style.transform = `rotate(${index * segmentAngle}deg) skewY(${90 - segmentAngle}deg)`;
        
        const text = document.createElement('div');
        text.className = 'wheel-segment-text';
        text.textContent = option;
        text.style.transform = `translate(-50%, -50%) rotate(${segmentAngle / 2}deg)`;
        
        segment.appendChild(text);
        wheel.appendChild(segment);
    });
}

function spin() {
    if (isSpinning || options.length === 0) return;
    
    isSpinning = true;
    spinBtn.disabled = true;
    result.textContent = '旋转中...';
    
    const segmentAngle = 360 / options.length;
    const randomIndex = Math.floor(Math.random() * options.length);
    const extraRotations = 5 + Math.floor(Math.random() * 3);
    const targetAngle = extraRotations * 360 + (360 - randomIndex * segmentAngle - segmentAngle / 2);
    
    currentRotation += targetAngle;
    wheel.style.transform = `rotate(${currentRotation}deg)`;
    
    setTimeout(() => {
        isSpinning = false;
        spinBtn.disabled = false;
        result.textContent = `结果：${options[randomIndex]}`;
    }, 4000);
}

function renderOptions() {
    optionsList.innerHTML = '';
    
    options.forEach((option, index) => {
        const item = document.createElement('div');
        item.className = 'option-item';
        
        const input = document.createElement('input');
        input.type = 'text';
        input.value = option;
        input.addEventListener('change', (e) => {
            options[index] = e.target.value;
            createWheel();
        });
        
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '删除';
        deleteBtn.addEventListener('click', () => {
            options.splice(index, 1);
            renderOptions();
            createWheel();
        });
        
        item.appendChild(input);
        item.appendChild(deleteBtn);
        optionsList.appendChild(item);
    });
}

function addOption() {
    const value = newOptionInput.value.trim();
    if (value) {
        options.push(value);
        newOptionInput.value = '';
        renderOptions();
        createWheel();
    }
}

spinBtn.addEventListener('click', spin);
addOptionBtn.addEventListener('click', addOption);
newOptionInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addOption();
    }
});

createWheel();
renderOptions();