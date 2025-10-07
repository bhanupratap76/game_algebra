    const questions = [
            { left: 3, right: 7, x: 4 },
            { left: 2, right: 8, x: 6 },
            { left: 4, right: 9, x: 5 }
        ];

        let currentQuestion = 0;
        let leftCoinsCount = questions[0].left;
        let rightCoinsCount = questions[0].right;
        let leftRemaining = leftCoinsCount;
        let rightRemaining = rightCoinsCount;
        let dragEnabled = false;
        let isDragging = false;
        let draggedElement = null;

        function initGame() {
            const q = questions[currentQuestion];
            leftCoinsCount = q.left;
            rightCoinsCount = q.right;
            leftRemaining = leftCoinsCount;
            rightRemaining = rightCoinsCount;
            
            document.getElementById('currentQ').textContent = currentQuestion + 1;
            document.getElementById('totalQ').textContent = questions.length;
            document.getElementById('inputA').value = '';
            document.getElementById('inputB').value = '';
            document.getElementById('inputA').disabled = false;
            document.getElementById('inputB').disabled = false;
            document.getElementById('feedback').classList.remove('show');
            document.getElementById('nextBtn').style.display = 'none';
            
            updateVisual();
        }

        function updateVisual() {
            const leftContainer = document.getElementById('leftCoins');
            const rightContainer = document.getElementById('rightCoins');
            
            leftContainer.innerHTML = '';
            rightContainer.innerHTML = '';
            
            // Add left coins
            for (let i = 0; i < leftRemaining; i++) {
                const coin = createCoin('left', i);
                leftContainer.appendChild(coin);
            }
            
            // Add right coins
            for (let i = 0; i < rightRemaining; i++) {
                const coin = createCoin('right', i);
                rightContainer.appendChild(coin);
            }
            
            updateStatus();
        }

        function createCoin(side, index) {
            const coin = document.createElement('div');
            coin.className = 'coin new';
            coin.textContent = '1';
            coin.dataset.side = side;
            coin.dataset.index = index;
            
            if (dragEnabled) {
                coin.draggable = true;
                coin.addEventListener('dragstart', handleDragStart);
                coin.addEventListener('dragend', handleDragEnd);
            }
            
            return coin;
        }

        function handleDragStart(e) {
            draggedElement = e.target;
            e.target.classList.add('dragging');
            isDragging = true;
        }

        function handleDragEnd(e) {
            e.target.classList.remove('dragging');
            
            if (isDragging && draggedElement) {
                const side = draggedElement.dataset.side;
                
                if (side === 'left') {
                    leftRemaining--;
                } else {
                    rightRemaining--;
                }
                
                updateVisual();
                checkBalance();
            }
            
            isDragging = false;
            draggedElement = null;
        }

        function updateStatus() {
            const statusMsg = document.getElementById('statusMessage');
            const instruction = document.getElementById('instruction');
            
            if (leftRemaining === 0 && rightRemaining > 0) {
                statusMsg.className = 'status-message success';
                statusMsg.textContent = `🎉 Perfect! You isolated x! The value of x is ${rightRemaining}`;
                instruction.textContent = 'Great job! Now answer the quiz below.';
                
                // Enable quiz
                document.getElementById('inputA').disabled = false;
                document.getElementById('inputB').disabled = false;
            } else if (leftRemaining === rightRemaining && leftRemaining < leftCoinsCount) {
                statusMsg.className = 'status-message balanced';
                statusMsg.textContent = '✓ Scale is balanced! Keep removing coins equally.';
            } else if (leftRemaining !== rightRemaining) {
                statusMsg.className = 'status-message unbalanced';
                statusMsg.textContent = '⚠️ Unbalanced! Remove coins to balance both sides equally.';
            } else {
                statusMsg.className = 'status-message balanced';
                statusMsg.textContent = 'The scale is balanced. Start by removing one coin from each side!';
            }
        }

        function checkBalance() {
            if (leftRemaining === 0 && rightRemaining > 0) {
                setTimeout(() => {
                    document.getElementById('instruction').textContent = 
                        'Excellent! Now complete the quiz to show you understand the equation!';
                }, 500);
            }
        }

        function showDragHint() {
            dragEnabled = true;
            document.getElementById('dragHintBtn').style.display = 'none';
            
            // Enable dragging on all pans
            document.getElementById('leftPan').addEventListener('dragover', handleDragOver);
            document.getElementById('rightPan').addEventListener('dragover', handleDragOver);
            document.getElementById('leftPan').addEventListener('drop', handleDrop);
            document.getElementById('rightPan').addEventListener('drop', handleDrop);
            
            updateVisual();
            
            document.getElementById('instruction').textContent = 
                'Drag coins OUT of the pans (drop them outside) to remove them. Keep the equation balanced!';
        }

        function handleDragOver(e) {
            e.preventDefault();
        }

        function handleDrop(e) {
            e.preventDefault();
            // Coins are removed when dragged outside, so we just prevent default
        }

        // Allow dropping anywhere in the visual area to remove coins
        document.querySelector('.visual-area').addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        document.querySelector('.visual-area').addEventListener('drop', (e) => {
            e.preventDefault();
            if (draggedElement) {
                handleDragEnd(e);
            }
        });

        function showHint() {
            const q = questions[currentQuestion];
            alert(`Hint: The equation is x + ${q.left} = ${q.right}\nWhen you remove all ${q.left} coins from the left, you'll have ${q.x} coins remaining on the right.\nSo x = ${q.x}, which means you need to fill: x + ${q.left} = ${q.right}`);
        }

        function checkAnswer() {
            const q = questions[currentQuestion];
            const answerA = parseInt(document.getElementById('inputA').value);
            const answerB = parseInt(document.getElementById('inputB').value);
            const feedback = document.getElementById('feedback');
            
            if (answerA === q.left && answerB === q.right) {
                feedback.className = 'feedback correct show';
                feedback.textContent = '🎉 Correct! You solved the equation!';
                document.getElementById('nextBtn').style.display = 'inline-block';
                document.getElementById('inputA').disabled = true;
                document.getElementById('inputB').disabled = true;
            } else {
                feedback.className = 'feedback incorrect show';
                feedback.textContent = '❌ Not quite. Look at the visual above and try again!';
            }
        }

        function nextQuestion() {
            currentQuestion++;
            if (currentQuestion < questions.length) {
                dragEnabled = false;
                document.getElementById('dragHintBtn').style.display = 'block';
                initGame();
            } else {
                alert('🎊 Congratulations! You completed all questions!');
                currentQuestion = 0;
                initGame();
            }
        }

        // Initialize
        initGame();