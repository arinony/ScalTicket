export const exportTicketsToCSV = (orders: any[]) => {
  // 1. Définir les colonnes (En-têtes)
  const headers = ["ID Commande", "Client", "Email", "Evenement", "Date", "Prix", "Statut"];

  // 2. Transformer les données en lignes
  const rows = orders.map(order => [
    order.id,
    order.user?.name || 'Inconnu',
    order.user?.email || '',
    order.event?.title || '',
    order.event?.date ? new Date(order.event.date).toLocaleDateString() : '',
    order.event?.price || 0,
    order.status
  ]);

  // 3. Créer le contenu CSV (avec point-virgule pour Excel FR)
  const csvContent = [
    headers.join(";"),
    ...rows.map(row => row.join(";"))
  ].join("\n");

  // 4. Créer le fichier et déclencher le téléchargement
  const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  
  link.setAttribute("href", url);
  link.setAttribute("download", `export_tickets_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};