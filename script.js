 // hamburger
 document.querySelector('.hamburger').addEventListener('click', function() {
    document.querySelector('.menu').classList.toggle('show');
 });

// sheet.html
const scriptUrl = 'https://script.google.com/macros/s/AKfycbxzGzk6M0JYzeKh7O-lqNs51VkA96Sl1R0G5qKDHcaZMgP_7lSHmjMAuDYu2jCp_a7d/exec';
let allSheets = [];

async function loadData() {
    const container = document.getElementById('mainContent');
    if(!container) return; 

    try {
        const response = await fetch(scriptUrl + '?action=getApproved');
        const data = await response.json();
        
        if (data && Array.isArray(data)) {
            allSheets = data;
            displayByGroup(allSheets); 
        } else {
            throw new Error('รูปแบบข้อมูลไม่ถูกต้อง');
        }
    } catch (error) {
        console.error('Error:', error);
        container.innerHTML = `<div class="loading">โหลดข้อมูลไม่สำเร็จ: ${error.message}</div>`;
    }
}

// ระดับชั้น 
window.filterByGrade = function(grade) {
    let filtered;
    if (grade === 'ทั้งหมด') {
        filtered = allSheets;
    } else {
        filtered = allSheets.filter(s => s.grade === grade);
    }
    displayByGroup(filtered, grade);
};

// วิชา
function displayByGroup(sheets, gradeTitle = 'ทั้งหมด') {
    const container = document.getElementById('mainContent');
    if (sheets.length === 0) {
        container.innerHTML = `<div class="loading">ยังไม่มีชีทสรุปใน ${gradeTitle}</div>`;
        return;
    }

    const grouped = sheets.reduce((acc, sheet) => {
        const subject = sheet.subject || 'อื่นๆ';
        if (!acc[subject]) acc[subject] = [];
        acc[subject].push(sheet);
        return acc;
    }, {});

    let htmlOutput = `<h2>ระดับชั้น: ${gradeTitle}</h2>`;

    for (const subject in grouped) {
        htmlOutput += `
            <div class="subject-section">
                <h3 class="subject-title">หมวดวิชา: ${subject}</h3>
                <div class="sheets-grid">
                    ${grouped[subject].map(sheet => `
                        <div class="sheet-card">
                            <h4>${sheet.sheetName}</h4>
                            <p>ระดับชั้น: ${sheet.grade}</p>
                            <button class="btn-view" onclick="viewPDF('${sheet.fileUrl}')">ดูชีทสรุป</button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    container.innerHTML = htmlOutput;
}

// PDF
window.viewPDF = function(url) {
    console.log('Opening URL:', url);
    const modal = document.getElementById('pdfModal');
    const frame = document.getElementById('pdfFrame');
    
    if (!url) {
        alert('ไม่พบลิงก์ไฟล์');
        return;
    }

    // แปลงลิงก์ Google Drive
    const fileId = url.match(/[-\w]{25,}/);
    frame.src = fileId ? `https://drive.google.com/file/d/${fileId[0]}/preview` : url;
    modal.style.display = 'block';
};


// ปิด Modal
document.querySelector('.close-modal')?.addEventListener('click', () => {
    document.getElementById('pdfModal').style.display = 'none';
    document.getElementById('pdfFrame').src = '';
});


if (document.getElementById('mainContent')) {
    loadData();
}

