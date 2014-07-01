/*
 *add a meta div to indicate installation & usage of stereopaw 
 *chrome extension
 */

var extension_meta = document.createElement("meta")
extension_meta.id="extension"
extension_meta.setAttribute("enabled", true)
extension_meta.setAttribute("type", "chrome")
document.head.appendChild(extension_meta)

