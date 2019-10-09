export class DanhSachSanPham {
    dssp = [];
    constructor() {

    }
    themMotSanPham(sanPham) {
        this.dssp = [...this.dssp, sanPham];
    }

    // renderTRSanPham() {
    //     let content = '';
    //     content = this.dssp.reduce((trContent, sp, index) => {
    //         trContent = trContent + `
    //             <tr>
    //              <td>${sp.maSP}</td>
    //              <td>${sp.tenSP}</td>
    //              <td>${sp.gia}</td>
    //              <td><img src="${sp.hinhAnh}" width="50" height="50" /></td>
    //              <td><button class="btn btn-dark" onclick="${sp.maSP}">Chỉnh sửa</button> <button class="btn btn-danger">Xóa</button></td>
    //             </tr>
    //         `;
    //         return trContent;
    //     }, '');


    //     return content;
    // }


}