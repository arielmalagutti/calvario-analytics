export function translateColumns(column_name:string){
  switch(column_name){
    case 'title':
      return 'título'
    case 'last_played_date':
      return 'última vez'
    case 'times_played_this_month':
      return 'este mês'
    case 'times_played_this_year':
      return 'este ano'
    case 'worship_date':
      return 'data'
    case 'lead':
      return 'ministro'
    case 'singers':
      return 'cantores'
    case 'music_titles':
      return 'músicas'
    default:
      return column_name
  }
}