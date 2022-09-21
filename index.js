(function() {
    'use-strict';
    window.onerror = e => alert(e);
    let elements;
    let result;
    function saveNumbers() {
        let values = {numbers:[],tax:elements[3].checked};
        elements.forEach((value) => values.numbers.push(parseFloat(value.value) || 0));
        localStorage.setItem('money-numbers', JSON.stringify(values));
    }
    function loadNumbers() {
        const num = localStorage.getItem('money-numbers');
        let values;
        if (!num) return;
        try {
            values = JSON.parse(num);
            if (!values) return;
            values.numbers.forEach((value, index) => {
                if (!elements[index]) return;
                elements[index].value = value;
            })
            elements[3].checked = values.tax;
        } catch(e) {
        	localStorage.removeItem('money-numbers');
        }
        processNumbers();
    }
    function processNumbers() {
        saveNumbers();
        let moneyNeeded = parseFloat(elements[0].value);
        if (elements[3] && elements[3].checked) {
            moneyNeeded *= 1.0825;
        }
        if (parseFloat(elements[1].value) < 0 || parseFloat(elements[2].value) < 0) {
            result.innerText = 'Lol you can\'t go below zero there silly';
            return;
        }
        if (parseFloat(elements[2].value) > 168) {
            result.innerText = 'Lol there are only 168 hours in a week silly';
            return;
        }
        const isNegative = moneyNeeded<0;
        moneyNeeded = Math.abs(moneyNeeded);
        let amnt = moneyNeeded/(parseFloat(elements[1].value)*parseFloat(elements[2].value));
        
        let days = amnt*7;
        let weeks = 0;
        let months = 0;
        let years = 0;
        const daysInMonth = 31;
        if (days === Infinity) {
            weeks = Infinity;
            months = Infinity;
            years = Infinity;
        } else {
            if (days >= daysInMonth*12) {
                years=Math.floor(days/(daysInMonth*12));
                days-=years*(daysInMonth*12);
            } else years=null;
            if (days >= daysInMonth) {
                months=Math.floor(days/daysInMonth);
                days-=months*daysInMonth;
            } else months=null;
            if (days >= 7) {
                weeks=Math.floor(days/7);
                days-=weeks*7;
            } else weeks=null;
            if (Math.ceil(days) === 7) {
                weeks++;
                days=0;
            }
        }
        
        if (isNaN(moneyNeeded)) moneyNeeded=null;
        if (years===null||isNaN(years)) years=null;
        else years=years.toFixed();
        if (months===null||isNaN(months)) months=null;
        else months=months.toFixed();
        if (weeks===null||isNaN(weeks)) weeks=null;
        else weeks=weeks.toFixed();
        if (days===null||isNaN(days)) days=null;
        else days=Math.ceil(days).toFixed();
        if (typeof moneyNeeded === 'number') moneyNeeded=moneyNeeded.toFixed(2);
        const forceAll = moneyNeeded===null;
        
        if ((moneyNeeded&&moneyNeeded.includes('e'))||(days&&days.includes('e'))||(weeks&&weeks.includes('e'))||(months&&months.includes('e'))||(years&&years.includes('e'))) {
            result.innerText = 'That\'s a big number (too big)';
            return;
        }
        
        if (years&&years>110) {
            result.innerText = 'You\'d be dead by then (most likely). It\'d take you '+years+' years!';
            return;
        }
        
        
        let resultText = 'If you '+(isNegative?'have':'need')+' $'+moneyNeeded+', ';
        let parts = [];
        if (years >= 1 || forceAll) {
            parts.push((years)+' year'+(years!=='1'?'s':''));
        }
        if (months >= 1 || forceAll) {
            parts.push((months)+' month'+(months!=='1'?'s':''));
        }
        if (weeks >= 1 || forceAll) {
            parts.push((weeks)+' week'+(weeks!=='1'?'s':''));
        }
        if (days >= 1 || forceAll) {
            parts.push((days)+' day'+(days!=='1'?'s':''));
        }
        if (parts.length === 0) {
            result.innerText = 'You already have enough money to afford your $'+moneyNeeded+' object';
            return;
        }
        parts.forEach((value, i, array) => {
            if (i === 0) {
                resultText += 'it would take you ';
            } else if (!array[i+1]) {
                resultText += ', and ';
            } else {
                resultText += ', ';
            }
            resultText += value;
        })
        resultText += ' to '+(isNegative?'give away':'earn')+' that much money.';
        result.innerText = resultText;
    }

    window.addEventListener('DOMContentLoaded', () => {
        result = document.getElementById('result');
        elements = [].slice.call(document.getElementById("main").getElementsByTagName("input"), 0);
		elements.forEach(elem => {
            elem.addEventListener('change', processNumbers);
            elem.addEventListener('keydown', processNumbers);
            elem.addEventListener('keyup', processNumbers);
        })
        loadNumbers();
    })

})();