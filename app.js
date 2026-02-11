async function loadGoldPrices() {
  try {
    const response = await fetch('data.json');
    const jsonData = await response.json();
    const data = jsonData.data;

    const priceMap = {};
    data.forEach(item => {
      priceMap[item.loaiVang] = {
        giaMua: item.giaMuaNiemYet,
        giaBan: item.giaBanNiemYet
      };
    });

    function formatPrice(price) {
      if (price === 0) {
        return '';
      }
      return (price / 1000).toLocaleString('vi-VN');
    }

    function formatDualPrices(price1, price2) {
      const formatted1 = formatPrice(price1);
      const formatted2 = formatPrice(price2);
      
      if (!formatted1 && !formatted2) return '';
      if (!formatted1) return formatted2;
      if (!formatted2) return formatted1;
      
      const br = document.createElement('br');
      const container = document.createElement('span');
      container.innerHTML = formatted1 + '<br>' + formatted2;
      return container.innerHTML;
    }

    function getDualPrices(loaiVang1, loaiVang2) {
      const prices1 = priceMap[loaiVang1] || { giaMua: 0, giaBan: 0 };
      const prices2 = priceMap[loaiVang2] || { giaMua: 0, giaBan: 0 };
      
      return {
        giaMua: formatDualPrices(prices1.giaMua, prices2.giaMua),
        giaBan: formatDualPrices(prices1.giaBan, prices2.giaBan),
        isDual: true
      };
    }

    const rows = document.querySelectorAll('#price-table-body tr');

    rows.forEach(row => {
      const cells = row.querySelectorAll('td');
      if (cells.length < 3) return;

      const productName = cells[cells.length - 4].textContent.trim();
      let prices = { giaMua: 0, giaBan: 0 };

      switch(productName) {
        case 'Nhẫn tròn ép vỉ':
          prices = priceMap['Nhẫn Tròn ép vỉ (Kim Gia Bảo ) 24K (999.9)'] || prices;
          break;
        case 'Nhẫn tròn BTMH':
          prices = priceMap['Nhẫn Tròn ép vỉ (Kim Gia Bảo ) 24K (999.9)'] || prices;
          break;

        case 'Đồng vàng Hoa sen':
          prices = priceMap['Đồng vàng Kim Gia Bảo hoa sen'] || prices;
          break;

        case 'Tứ Quý (Tùng, Cúc, Trúc, Mai)':
          const categoryCell = row.closest('tbody').querySelector('.category');
          prices = priceMap['Vàng Tiểu Kim Cát 24K (999.9) 0,1chỉ'] || prices;
          break;

        case 'Lúa, Đậu, Lạc':
          prices = priceMap['Vàng Tiểu Kim Cát 24K (999.9) 0,1chỉ'] || prices;
          break;

        case 'Trang sức 24K':
          prices = getDualPrices(
            'Vàng trang sức  24K (999.9)',
            'Vàng trang sức 24K (99.9)'
          );
          break;

        case 'Khối, thỏi, hạt, miếng, và các loại khác':
          prices = getDualPrices(
            'Vàng nguyên liệu 999,9',
            'Vàng nguyên liệu 99.9'
          );
          break;

        case 'Vàng miếng SJC (Công ty cổ phần Bảo Tín Mạnh Hải)':
          prices = priceMap['Vàng miếng SJC (Cty CP BTMH)'] || prices;
          break;
      }

      // Update price cells (last 2 cells)
      const muaCell = cells[cells.length - 2];
      const banCell = cells[cells.length - 1];

      if (prices.isDual) {
        muaCell.innerHTML = prices.giaMua;
        banCell.innerHTML = prices.giaBan;
      } else {
        muaCell.textContent = formatPrice(prices.giaMua);
        banCell.textContent = formatPrice(prices.giaBan);
      }
    });

  } catch (error) {
    console.error('Error loading gold prices:', error);
  }
}

// Load prices when page loads
document.addEventListener('DOMContentLoaded', loadGoldPrices);
