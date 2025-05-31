import { makeAutoObservable } from 'mobx'
// import agent from '../api/agent.ts'
// import { toast } from 'react-toastify'
// import { AddSizeDto, ProductSizeDto } from '../models/product/productSize.model.ts'
import { RoleDto } from '../models/role/role.model.ts'

export default class RoleStore {
  roleList: RoleDto[] = [];
  roleRegistry = new Map<number, RoleDto>();
  loading = false;
  term: string = '';

//   roleForm: AddRoleDto = {
//     name: ""
//   };

  constructor() {
    makeAutoObservable(this);
  }

  setRoleList = (list: RoleDto[]) => {
    this.roleList = list;
  } 

//   setTerm = (term: string) => {
//     this.term = term;
//     this.loadRoles(this.term);
//   }

//   loadRoles = async (term?: string) => {
//     this.loading = true;
//     try {
//       const result = await agent.Role.roleList(term);
//       runInAction(() => {
//         this.roleList = result.data || [];
//         this.loading = false;

//         // Optionally: store suppliers in a Map
//         this.roleRegistry.clear();
//         this.roleList.forEach(role => {
//           if (role.id != null) this.roleRegistry.set(role.id, role);
//         });
//       });
//     } catch (error) {
//       runInAction(() => {
//         this.loading = false;
//       });
//       console.error("Failed to load role", error);
//       toast.error("Lỗi khi tải dữ liệu vai trò.")
//     }
//   };

//   resetRoleForm = () => {
//     this.roleForm = {
//       name: ""
//     };
//   };

//   updateSizeForm = <K extends keyof AddSizeDto>(key: K, value: AddSizeDto[K]) => {
//     this.sizeForm[key] = value;
//   };

}