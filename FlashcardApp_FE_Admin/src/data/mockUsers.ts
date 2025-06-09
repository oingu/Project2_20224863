// frontend/src/data/mockUsers.ts
export interface User {
    id: string;
    fullName: string;
    email: string;
    status: "Active" | "Inactive" | "Pending";
  }
  
  export const mockUsers: User[] = [
    { id: "1",  fullName: "Nguyễn Văn A",       email: "a.nguyen@example.com",     status: "Active"   },
    { id: "2",  fullName: "Trần Thị B",          email: "b.tran@example.com",       status: "Inactive" },
    { id: "3",  fullName: "Lê Văn C",            email: "c.le@example.com",         status: "Pending"  },
    { id: "4",  fullName: "Phạm Thị D",          email: "d.pham@example.com",       status: "Active"   },
    { id: "5",  fullName: "Hoàng Văn E",         email: "e.hoang@example.com",      status: "Active"   },
    { id: "6",  fullName: "Vũ Thị F",            email: "f.vu@example.com",         status: "Inactive" },
    { id: "7",  fullName: "Đặng Văn G",          email: "g.dang@example.com",       status: "Active"   },
    { id: "8",  fullName: "Bùi Thị H",           email: "h.bui@example.com",        status: "Pending"  },
    { id: "9",  fullName: "Đỗ Văn I",            email: "i.do@example.com",         status: "Active"   },
    { id: "10", fullName: "Ngô Thị K",           email: "k.ngo@example.com",        status: "Inactive" },
    { id: "11", fullName: "Phan Văn L",          email: "l.phan@example.com",       status: "Active"   },
    { id: "12", fullName: "Trịnh Thị M",         email: "m.trinh@example.com",      status: "Pending"  },
    { id: "13", fullName: "Đỗ Thị N",            email: "n.do@example.com",         status: "Active"   },
    { id: "14", fullName: "Lý Văn O",            email: "o.ly@example.com",         status: "Inactive" },
    { id: "15", fullName: "Hồ Thị P",            email: "p.ho@example.com",         status: "Active"   },
  ];
  