package backend.example.backend.config;

import backend.example.backend.module.auth.AuthenticationService;
import backend.example.backend.module.auth.dto.IntrospectRequest;
import com.nimbusds.jose.JOSEException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.stereotype.Component;

import javax.crypto.spec.SecretKeySpec;
import java.text.ParseException;
import java.util.Objects;

@Component
@RequiredArgsConstructor
public class CustomJWTDecoder implements JwtDecoder {
    @Value("${jwt.signer-key}")
    String signerKey;
    AuthenticationService authenticationService;
    private NimbusJwtDecoder nimbusJwtDecoder = null;
    @Override
    public Jwt decode(String token) throws JwtException {
        try {
            var response = authenticationService.introspect(IntrospectRequest.builder()
                            .token(token)
                    .build());
            if (!response.isValid())
            {
                throw new JwtException("Token Invalid");
            }
        }
        catch (JOSEException | ParseException e)
        {
            throw new JwtException(e.getMessage());
        }
        if (Objects.isNull(nimbusJwtDecoder))
        {
            SecretKeySpec spec = new SecretKeySpec(signerKey.getBytes(), "HS512");
            nimbusJwtDecoder = NimbusJwtDecoder
                    .withSecretKey(spec)
                    .macAlgorithm(MacAlgorithm.HS512)
                    .build();
        }
        return nimbusJwtDecoder.decode(token);
    }
}
