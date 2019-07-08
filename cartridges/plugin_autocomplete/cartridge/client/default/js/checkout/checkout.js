var base = require('base/checkout/checkout');

// function to parse the address from google and return an address object
var getAddressObject = function (address_components) {
    var ShouldBeComponent = {
            home: ["street_number"],
            postal_code: ["postal_code"],
            street: ["street_address", "route"],
            region: [
              "administrative_area_level_1",
              "administrative_area_level_2",
              "administrative_area_level_3",
              "administrative_area_level_4",
              "administrative_area_level_5"
            ],
            city: [
              "locality",
              "sublocality",
              "sublocality_level_1",
              "sublocality_level_2",
              "sublocality_level_3",
              "sublocality_level_4"
            ],
            country: ["country"]
          };

      var address = {
        home: "",
        postal_code: "",
        street: "",
        region: "",
        city: "",
        country: ""
      };
      
      address_components.forEach(component => {
        for (var shouldBe in ShouldBeComponent) {
          if (ShouldBeComponent[shouldBe].indexOf(component.types[0]) !== -1) {
            if (shouldBe === "country" || shouldBe === "region") {
              address[shouldBe] = component.short_name;
            } else {
            	address[shouldBe] = component.long_name;
            }
          }
        }
      });
      
      return address;
}

//function used to auto populate the billing/shipping form
var fillGoogleAddress = function (finalAddress, type) {
	var addressBlock;
	if (type === 'shipping') {
		addressBlock = $('.shipping-address-block:visible');
		addressBlock.find('#shippingAddressOnedefault').val(finalAddress.home + ' ' + finalAddress.street);
		addressBlock.find('#shippingAddressCitydefault').val(finalAddress.city);
		addressBlock.find('#shippingZipCodedefault').val(finalAddress.postal_code);
		addressBlock.find('#shippingCountrydefault').val(finalAddress.country);
		
		if (addressBlock.find('#shippingStatedefault').length > 0) {
			addressBlock.find('#shippingStatedefault').val(finalAddress.region);
		}
		
	} else {
		addressBlock = $('.billing-address:visible');
		addressBlock.find('#billingAddressOne').val(finalAddress.home + ' ' + finalAddress.street);
		addressBlock.find('#billingAddressCity').val(finalAddress.city);
		addressBlock.find('#billingZipCode').val(finalAddress.postal_code);
		addressBlock.find('#billingCountry').val(finalAddress.country);
		
		if (addressBlock.find('#billingState').length > 0) {
			addressBlock.find('#billingState').val(finalAddress.region);
		}
	}
		
}

// function used to trigger auto complete on checkout pages for billing and shipping
base.triggerAutoComplete =  function () {
    var shippingAutoComplete;
    var billingAutoComplete;
    var place;
    var finalAddress;
    var options = {
	   types: ["address"]
	};

    // Create the auto complete object for shipping
	// location types.
    shippingAutoComplete = new google.maps.places.Autocomplete(document.getElementById('shippingAddressOnedefault'),options);
    shippingAutoComplete.addListener('place_changed', function () {
        place = shippingAutoComplete.getPlace();
        finalAddress = getAddressObject(place.address_components);
        fillGoogleAddress(finalAddress, 'shipping');
    });
    
    // Create the auto complete object for billing
	// location types.
    billingAutoComplete = new google.maps.places.Autocomplete(document.getElementById('billingAddressOne'),options);
    billingAutoComplete.addListener('place_changed', function () {
        place = billingAutoComplete.getPlace();
        finalAddress = getAddressObject(place.address_components);
        fillGoogleAddress(finalAddress, 'billing');
    });
};

module.exports = base;