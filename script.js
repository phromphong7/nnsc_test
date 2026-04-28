 document.querySelector('.hamburger').addEventListener('click', function() {
    document.querySelector('.menu').classList.toggle('show');
 });

// ฟังก์ชันโหลดข้อมูล (สำหรับหน้า sheet.html)
async function loadApprovedSheets() {
    // เปลี่ยน URL เป็น Web App URL ของคุณ
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbzIHSKH6Z6Or12kluO6xdk983kyT2BzC7fw64Y8W-K2BFdbNr6W_5n71sHPe2bqXNsP/exec';
    
    try {
        const res = await fetch(scriptUrl + '?action=getApproved');
        const data = await res.json();
        console.log('ชีทสรุปที่อนุมัติแล้ว:', data);
        return data;
    } catch (error) {
        console.error('เกิดข้อผิดพลาด:', error);
        return [];
    }
}