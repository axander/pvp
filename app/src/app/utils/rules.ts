export class Rules {

    /**
     * Función para validar que los controles estén correctos
     * @param form El formulario contenedor para recorrer los campos
     */

    public static staplingMaxPages(_item: any, _rule: { value: any }, _value: any): Promise<any> {
        let promise = new Promise((resolve, reject) => {
            setTimeout(() => {
                if (!_value) {
                    resolve({success:true})
                    return
                }
                if (!_rule.value || !_rule.value.files) {
                    resolve({success:true})
                    return
                }
                let pages: number = 0;
                _rule.value.files.map((x: { numPages: any; }) => {
                    console.log(x.numPages);
                    pages = pages + x.numPages!;
                });
                if (pages <= _value) {
                    resolve({success:true})
                } else {
                    resolve({success:false})
                }
            }, 0);
        });
        return Promise.all([promise.catch(err => {
            throw err
        })]).then(([promise]) => {
            !promise ? promise = new Promise((resolve, reject) => { })
                : null;
            return Promise.all([promise])
        }, err => {
        });
    }

    public static spiralMinPages(_rule: { value: any }, _value: any) {
        if (!_value) return true
        let pages: number = 0;
        _rule.value.files.map((x: { numPages: any; }) => {
            console.log(x.numPages);
            pages = pages + x.numPages!;
        });
        if (pages >= _value) {
            return true
        } else {
            return false
        }
    }
}
