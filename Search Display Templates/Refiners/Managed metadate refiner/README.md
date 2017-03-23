# Managed metadata refiner

These display templates are developed to render the hierarchy of the specified term set.

![Output example](assets/refiner-template.png)

As you can see in the next screenshot, it renders the same hierarchy:

![Term set](assets/termset.png)

## File(s)

File | Description
--- | ---
__Filter_ManagedMetadata_Label.html__ | This is the label version managed metadata refiner display template. **Important**: this template is created to be used in combination with the label value of the term, not the taxId.
__Filter_ManagedMetadata_TaxID.html__ | This is the taxid version managed metadata refiner display template. **Important**: this template is created to be used in combination with the TaxID value of the term, not the label.
__Filter_ManagedMetadata_TaxID_parent.html__ | This is a similar template as the TaxID one, but with this version you can refine on the parents. **Important**: this template is created to be used in combination with the TaxID value of the term, not the label.
__filter_mm.css__ | This is the required css file for styling the managed metadata hierarchy.

Here is an example of how the **Filter_ManagedMetadata_TaxID_parent.html** renders compared to the other two:

![Term set](assets/refiner-template-parent.png)

## Configuration

If you want to make use of these templates, you will have to go through the following configuration steps:

- Be sure which template you are going to pick, the term label version or taxid version
- Open the HTML display template and find the CSS reference: `$includeCSS('this.url', '~sitecollection/_catalogs/masterpage/MMRefiner/filter_mm.css');`
- Validate the CSS reference, if the location is different on your environment, update it to your location
- In the file you will find the following variables that need some configuration:

```javascript
termStoreName = '<Term-Store-Name-OPTIONAL>',
termSetId = '<Term-Set-ID>',
```

- **termStoreName**: this property is optional. By default, it will take the default keyword term store. If you need, you can uncomment the following lines of code so that you can specify the term store by its name:

```javascript
// Get all term stores
// var termStores = taxSession.get_termStores();
// Name of the Term Store from which to get the Terms.
// var termStore = termStores.getByName(termStoreName);
```

- **termSetId**: for this property, you need to fill in the ID of the term set. You can find it at the bottom of the term set page:

![Term set ID](assets/termsetId.png)

- Once you did these configuration steps, you can upload the file to your master page gallery and use it.

### Optional: Showing or hiding terms that cannot be refined

By default the templates renders the complete term set hierarchy. If you want to only show the terms that can be filtered on, you have to uncomment the following lines in the CSS file:

```css
/*.term {
	display: none;
}

.term.show {
	display: block;
}*/
```

This results in:

![Term set ID](assets/show-refiners.png)