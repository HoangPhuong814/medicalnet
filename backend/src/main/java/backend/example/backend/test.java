package backend.example.backend;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class test {
    @GetMapping("/ping")
    public ResponseEntity<String> testConnection()
    {
        return ResponseEntity
                .status(200)
                .body("Ping 200 Ok");
    }
}
