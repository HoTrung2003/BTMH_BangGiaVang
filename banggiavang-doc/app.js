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
      if (!price || price === 0) {
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
      
      return formatted1 + '<br>' + formatted2;
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

      // The product name is either in the last 4th cell (if category exists) or last 3rd cell (if category merged)
      // Actually, looking at HTML structure: 
      // category-row: [cat, prod, type, mua, ban] (5 cells)
      // data-row: [prod, type, mua, ban] (4 cells)
      // special SJC: [cat+prod, type, mua, ban] (3 cells)

      let productName = "";
      let muaCell, banCell;

      if (cells.length === 5) {
          productName = cells[1].textContent.trim();
          muaCell = cells[3];
          banCell = cells[4];
      } else if (cells.length === 4) {
          productName = cells[0].textContent.trim();
          muaCell = cells[2];
          banCell = cells[3];
      } else if (cells.length === 3) {
          productName = cells[0].textContent.trim();
          muaCell = cells[1];
          banCell = cells[2];
      }

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
        case 'Vàng miếng SJC (Công ty cổ phần BTMH)':
          prices = priceMap['Vàng miếng SJC (Cty CP BTMH)'] || prices;
          break;
      }

      if (prices.isDual) {
        muaCell.innerHTML = prices.giaMua;
        banCell.innerHTML = prices.giaBan;
      } else {
        muaCell.textContent = formatPrice(prices.giaMua);
        banCell.textContent = formatPrice(prices.giaBan);
      }

      // Add "price" class for bigger font if needed
      muaCell.classList.add('price');
      banCell.classList.add('price');
    });

  } catch (error) {
    console.error('Error loading gold prices:', error);
  }
}

document.addEventListener('DOMContentLoaded', loadGoldPrices);
