/**
* Validation code for field backgroundImage on popupStyling
* @param {import("gadget-server").PopupStylingBackgroundImageFieldValidationContext } context - All the useful bits for running this validation.
*/
export default async ({api, record, errors, logger, field}) => {
    // TODO: implement validation
    // access things like `record.backgroundImage` to get the fields's data
    // add to the `errors` with `errors.add('backgroundImage', "did not pass the validation")`

    const url = record?.backgroundImage?.url

  if (url !== 'null') {
      
    }
};