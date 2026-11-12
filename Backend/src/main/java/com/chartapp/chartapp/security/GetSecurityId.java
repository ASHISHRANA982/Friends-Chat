package com.chartapp.chartapp.security;

import io.jsonwebtoken.Claims;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;

@Component
public class GetSecurityId {


    private final JwtAuth jwtAuth;

    public GetSecurityId(JwtAuth jwtAuth) {
        this.jwtAuth = jwtAuth;
    }

    public int SecurityIdChecker(HttpServletRequest request){

        Cookie[]cookies=request.getCookies();
        String token=null;

        if(cookies!=null)
        {
            for(Cookie cookie:cookies){
                if("Refresh_Token".equals(cookie.getName())){
                    token=cookie.getValue();
                    break;
                }
            }
        }

        Claims claims= jwtAuth.getId(token);
        return (Integer) claims.get("id");
    }


}
