export default function getTrasactionType(tx: string){
    if(tx === 'createAsset'){
        return 'create'
    }
    if(tx === 'updateAsset'){
        return 'update'
    }
    if(tx === 'deleteAsset'){
        return 'delete'
    }
    else return ''
}