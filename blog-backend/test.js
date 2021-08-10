const inno = {
    //요청 주소 세팅
    const apiAddress: {
        //도메인
        commonDomain:"http://localhost:8080",
        //API 주소 세팅
        getApiAddress:(path) => {
            return `${adiAddress.commonDomain}/${path}`;
        }
    },
    
    //서버와 통신
    requestMan:{
        getPackageList: async () => {
            try{
                let resp = await fetch(apiAddress.getApiAddress("/adminProductList"));
                let packageList = await resp.json();
                inno.dataMan.packageData = packageList;
            }catch (e){
                console.log(e);
            }
        }
    },
    
    //데이터 관리
    dataMan:{
        packageData:[],
    },
};

window.onload = () => {
    
}