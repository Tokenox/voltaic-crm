import { Controller, Inject } from "@tsed/di";
import { BodyParams, Context, QueryParams } from "@tsed/platform-params";
import { Get, Post, Required, Returns } from "@tsed/schema";
import { AdminService } from "../../services/AdminService";
import { OrganizationResultModel } from "../../models/RestModels";
import { OrganizationService } from "../../services/OrganizationService";
import { SuccessArrayResult } from "../../util/entities";

@Controller("/org")
export class OrganizationController {
  @Inject()
  private organizationService: OrganizationService;

  @Inject()
  private adminService: AdminService;

  @Get("/")
  @Returns(200, SuccessArrayResult).Of(OrganizationResultModel)
  public async getOrgs(@QueryParams() query: { id?: string }, @Context() context: Context) {
    const user = context.get("user");
    const orgs = await this.organizationService.findOrganizations();
    const response = {
      orgs: orgs.map((org) => {
        return {
          id: org.id,
          name: org.name,
          email: org.email,
          createdAt: org.createdAt,
          updatedAt: org.updatedAt
        };
      })
    };
    return new SuccessArrayResult(response.orgs, OrganizationResultModel);
  }
}
