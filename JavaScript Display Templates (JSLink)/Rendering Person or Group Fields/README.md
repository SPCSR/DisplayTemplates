Sample: Rendering Person or Group fields
================

This folder contains a sample list view display template that shows how the default rendering behaviour of the Person or Group field can be recreated in your custom templates.

__csr_ovr_RenderPeopleField.js__             | This template renders a single page of results without any paging ability

This sample was created with a specific set of fields in a custom list in mind:-

__Person__ | Contains a single person object
__People__ | Allows the user to enter multiple person objects
__People Or Groups__ | Allows the user to add people or group objects into the field.

Each of these will be displayed in the output, honouring the original display settings from the field configuration. For more details, [please see this blog post.] (http://www.myfatblog.co.uk/index.php/2015/12/rendering-people-or-group-fields-in-custom-jslink-display-templates/)