import type { StructureResolver } from "sanity/structure";

/**
 * Studio sidebar. Ordered by how often the team will actually touch things:
 * properties first, settings last. Singletons are pinned so nobody can
 * accidentally create a second Homepage document.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Roar Realty")
    .items([
      S.listItem()
        .title("Properties")
        .child(
          S.list()
            .title("Properties")
            .items([
              S.listItem()
                .title("All properties")
                .child(S.documentTypeList("property").title("All properties")),
              S.listItem()
                .title("Featured on homepage")
                .child(
                  S.documentList()
                    .title("Featured")
                    .filter('_type == "property" && featured == true')
                ),
              S.listItem()
                .title("⚠️ Illustrative samples")
                .child(
                  S.documentList()
                    .title("Illustrative samples")
                    .filter('_type == "property" && illustrative == true')
                ),
              S.listItem()
                .title("Missing photos")
                .child(
                  S.documentList()
                    .title("Missing photos")
                    .filter('_type == "property" && count(images) == 0')
                ),
            ])
        ),

      S.divider(),

      S.documentTypeListItem("locality").title("Localities"),
      S.documentTypeListItem("builder").title("Builders"),
      S.documentTypeListItem("teamMember").title("Team & agents"),
      S.documentTypeListItem("testimonial").title("Testimonials"),
      S.documentTypeListItem("insight").title("Insights"),
      S.documentTypeListItem("faq").title("FAQs"),

      S.divider(),

      S.listItem()
        .title("Homepage")
        .id("homepage")
        .child(S.document().schemaType("homepage").documentId("homepage")),
      S.listItem()
        .title("Site settings")
        .id("siteSettings")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
    ]);
