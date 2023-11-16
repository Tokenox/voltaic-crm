import { Inject, Injectable } from "@tsed/di";
import { RoleModel } from "../models/RoleModel";
import { CategoryBodyTypes, FieldTypes, RoleBodyTypes } from "types";
import { LeadService } from "./LeadService";
import { MongooseModel } from "@tsed/mongoose";

@Injectable()
export class RoleService {
  constructor(
    @Inject(RoleModel) private role: MongooseModel<RoleModel>,
  ) {}

  public async findRoles() {
    return await this.role.find();
  }

  public async findRoleById(_id: string) {
    return await this.role.findById(_id);
  }

  public async createRole({name}: RoleBodyTypes) {
    return await this.role.create({ name: name });
  }

  public async updateRole({ _id, name}: RoleBodyTypes & { _id: string }) {
    return await this.role.findByIdAndUpdate(_id, { name});
  }

  public async findRole() {
    return await this.role.findOne();
  }

}
