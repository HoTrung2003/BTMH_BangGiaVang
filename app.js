window.addEventListener("DOMContentLoaded", () => {
  fetch("data.json")
    .then((res) => res.json())
    .then((result) => {
      if (result.status !== 200) return;

      const rows = document.querySelectorAll("#price-table-body tr");
      const dataItems = result.data || [];

      // Mapping: keyword → loaiVang in JSON
      const mapping = {
        "Vàng miếng SJC": "Vàng miếng SJC (Cty CP BTMH)",
        "Đồng vàng Hoa sen": "Đồng vàng Kim Gia Bảo hoa sen",
        "Nhẫn tròn ép vi": "Nhẫn Tròn ép vỉ (Kim Gia Bảo ) 24K (999.9)",
        "Lúa, Đậu, Lạc": "Vàng Tiểu Kim Cát 24K (999.9) 0,1chỉ",
        "Trang sức 24K": "Vàng trang sức 24K (99.9)",
        "Tứ Quý (Tùng, Cúc, Trúc, Mai)":
          "Nhẫn Tròn ép vỉ (Kim Gia Bảo ) 24K (999.9)", // Kim Gia Bảo
        "Nhẫn tròn BTMH": "Nhẫn Tròn ép vỉ (Kim Gia Bảo ) 24K (999.9)",
      };

      rows.forEach((tr) => {
        const tds = Array.from(tr.querySelectorAll("td"));
        if (tds.length < 1) return;

        const col1 = (tds[0].textContent || "").trim();
        const col2 =
          tds[0].hasAttribute("colspan") &&
          parseInt(tds[0].getAttribute("colspan"), 10) >= 2
            ? ""
            : tds[1]
            ? (tds[1].textContent || "").trim()
            : "";

        const muaCell = tds[tds.length - 2];
        const banCell = tds[tds.length - 1];

        // Special case: "Nguyên liệu"
        if (col1.includes("Nguyên liệu")) {
          const nl999 = dataItems.find(
            (item) => item.loaiVang === "Vàng nguyên liệu 999,9"
          );
          const nl99 = dataItems.find(
            (item) => item.loaiVang === "Vàng nguyên liệu 99.9"
          );

          if (nl999 && nl99) {
            const mua =
              (nl999.giaMuaNiemYet > 0
                ? nl999.giaMuaNiemYet.toLocaleString()
                : "") +
              "<br />" +
              (nl99.giaMuaNiemYet > 0
                ? nl99.giaMuaNiemYet.toLocaleString()
                : "");
            const ban =
              nl999.giaBanNiemYet.toLocaleString() +
              "<br />" +
              nl99.giaBanNiemYet.toLocaleString();

            if (muaCell) muaCell.innerHTML = mua;
            if (banCell) banCell.innerHTML = ban;
            return;
          }
        }

        // Special case: Tứ Quý in Tiểu Kim Cát
        if (col1.includes("Tiểu Kim Cát") && col2.includes("Tứ Quý")) {
          const matchedItem = dataItems.find(
            (item) => item.loaiVang === "Vàng Tiểu Kim Cát 24K (999.9) 0,1chỉ"
          );
          if (matchedItem) {
            if (muaCell) {
              muaCell.textContent =
                matchedItem.giaMuaNiemYet && matchedItem.giaMuaNiemYet > 0
                  ? matchedItem.giaMuaNiemYet.toLocaleString()
                  : "";
            }
            if (banCell) {
              banCell.textContent =
                matchedItem.giaBanNiemYet && matchedItem.giaBanNiemYet > 0
                  ? matchedItem.giaBanNiemYet.toLocaleString()
                  : "";
            }
            return;
          }
        }

        // Check mapping
        let matchedItem = null;
        for (const [keyword, loaiVang] of Object.entries(mapping)) {
          if (col1.includes(keyword) || col2.includes(keyword)) {
            matchedItem = dataItems.find((item) => item.loaiVang === loaiVang);
            if (matchedItem) break;
          }
        }

        if (matchedItem) {
          if (muaCell) {
            muaCell.textContent =
              matchedItem.giaMuaNiemYet && matchedItem.giaMuaNiemYet > 0
                ? matchedItem.giaMuaNiemYet.toLocaleString()
                : "";
          }
          if (banCell) {
            banCell.textContent =
              matchedItem.giaBanNiemYet && matchedItem.giaBanNiemYet > 0
                ? matchedItem.giaBanNiemYet.toLocaleString()
                : "";
          }
        }
      });
    })
    .catch((err) => console.error("Lỗi lấy dữ liệu:", err));
});
