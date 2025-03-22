const max_len = 7 ; 

export function generate(){
    let ans = "";
    const subset = "9876543210mnbvcxzlkjhgfdsapoiuytrewq";

    for(let i = 0 ; i < max_len ; i++){
        ans += subset[Math.floor(Math.random()*subset.length)];
    }   

    return ans;
}