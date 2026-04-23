variable "resource_group_name" {
  description = "Nom du Resource Group Azure"
  type        = string
  default     = "jass-rg"
}
variable "location_actif" {
  description = "Région du cluster AKS actif"
  type        = string
  default     = "westeurope"
}
variable "location_pass" {
  description = "Région du cluster AKS pass"
  type        = string
  default     = "northeurope"
}
variable "acr_name" {
  description = "Nom de l'Azure Container Registry"
  type        = string
  default     = "jassacr"
}
variable "aks_actif_name" {
  description = "Nom du cluster AKS actif"
  type        = string
  default     = "jass-aks-actif"
}
variable "aks_pass_name" {
  description = "Nom du cluster AKS pass"
  type        = string
  default     = "jass-aks-pass"
}
variable "node_count" {
  description = "Nombre de nodes par cluster"
  type        = number
  default     = 2
}
variable "node_vm_size" {
  description = "Taille des VMs pour les nodes AKS"
  type        = string
  default     = "Standard_B2s"
}
variable "kubernetes_version" {
  description = "Version de Kubernetes"
  type        = string
  default     = "1.33"
}
