// Supporting components
import '../ids-block-grid';
// Listing Page
import '../../ids-demo-app/ids-demo-listing';
import indexYaml from './index.yaml';
import placeHolderImg from '../../../assets/images/placeholder-200x200.png';
// Images
const images = document.querySelectorAll('img');
images.forEach((img) => {
    img.src = placeHolderImg;
});
const demoListing = document.querySelector('ids-demo-listing');
if (demoListing) {
    demoListing.data = indexYaml.examples;
}
//# sourceMappingURL=index.js.map