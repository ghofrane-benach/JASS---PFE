# ── Resource Group 
resource "azurerm_resource_group" "jass" {
  name     = var.resource_group_name
  location = "francecentral"   
  tags = {
    project     = "JASS"
    environment = "production"
    managed_by  = "terraform"
  }
}
# ── Azure Container Registry 
resource "azurerm_container_registry" "acr" {
  name                = var.acr_name
  resource_group_name = azurerm_resource_group.jass.name
  location            = "francecentral"   
  sku                 = "Basic"
  admin_enabled       = true

  tags = {
    project    = "JASS"
    managed_by = "terraform"
  }
}
# ── AKS Cluster ACTIF (westeurope) 
resource "azurerm_kubernetes_cluster" "actif" {
  name                = var.aks_actif_name
  location            = "westeurope"                      
  resource_group_name = azurerm_resource_group.jass.name
  dns_prefix          = "jass-aks-a-jass-rg-c0ba51"      
  kubernetes_version  = "1.33"

  default_node_pool {
    name       = "nodepool1"
    node_count = 2
    vm_size    = "Standard_D2s_v5"   
  }
  identity {
    type = "SystemAssigned"
  }
  tags = {
    project    = "JASS"
    role       = "actif"
    managed_by = "terraform"
  }
}

# ── AKS Cluster PASS (northeurope) 
resource "azurerm_kubernetes_cluster" "pass" {
  name                = var.aks_pass_name               # = "jass-aks-pass"
  location            = "northeurope"                     
  resource_group_name = azurerm_resource_group.jass.name
  dns_prefix          = "jass-aks-p-jass-rg-c0ba51"      
  kubernetes_version  = "1.33"

  default_node_pool {
    name       = "nodepool1"
    node_count = 2
    vm_size    = "Standard_B4s_v2"   
  }

  identity {
    type = "SystemAssigned"
  }

  tags = {
    project    = "JASS"
    role       = "pass"
    managed_by = "terraform"
  }
}

resource "azurerm_role_assignment" "acr_pull_actif" {
  principal_id                     = azurerm_kubernetes_cluster.actif.kubelet_identity[0].object_id
  role_definition_name             = "AcrPull"
  scope                            = azurerm_container_registry.acr.id
  skip_service_principal_aad_check = true
}

resource "azurerm_role_assignment" "acr_pull_pass" {
  principal_id                     = azurerm_kubernetes_cluster.pass.kubelet_identity[0].object_id
  role_definition_name             = "AcrPull"
  scope                            = azurerm_container_registry.acr.id
  skip_service_principal_aad_check = true
}
