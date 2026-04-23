# ── ACR 
output "acr_login_server" {
  description = "URL du registre ACR"
  value       = azurerm_container_registry.acr.login_server
}
output "acr_admin_username" {
  description = "Username admin ACR"
  value       = azurerm_container_registry.acr.admin_username
}
output "acr_admin_password" {
  description = "Mot de passe admin ACR"
  value       = azurerm_container_registry.acr.admin_password
  sensitive   = true
}
# ── AKS Actif 
output "aks_actif_name" {
  description = "Nom du cluster AKS actif"
  value       = azurerm_kubernetes_cluster.actif.name
}
output "aks_actif_host" {
  description = "Endpoint API du cluster AKS actif"
  value       = azurerm_kubernetes_cluster.actif.kube_config[0].host
  sensitive   = true
}
output "aks_actif_kubeconfig" {
  description = "Kubeconfig du cluster AKS actif"
  value       = azurerm_kubernetes_cluster.actif.kube_config_raw
  sensitive   = true
}
# ── AKS Passif 
output "aks_pass_name" {
  description = "Nom du cluster AKS pass"
  value       = azurerm_kubernetes_cluster.pass.name
}
output "aks_pass_host" {
  description = "Endpoint API du cluster AKS pass"
  value       = azurerm_kubernetes_cluster.pass.kube_config[0].host
  sensitive   = true
}
output "aks_pass_kubeconfig" {
  description = "Kubeconfig du cluster AKS pass"
  value       = azurerm_kubernetes_cluster.pass.kube_config_raw
  sensitive   = true
}
