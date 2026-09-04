package backend.example.backend.common.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
@AllArgsConstructor
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999, "Uncategorized Exception", HttpStatus.INTERNAL_SERVER_ERROR),
    USER_EXISTED(1002, "User existed", HttpStatus.BAD_REQUEST),
    USER_NOT_EXISTED(1003, "User not existed", HttpStatus.NOT_FOUND),
    INVALID_PASSWORD(1004, "Invalid password",HttpStatus.BAD_REQUEST),
    DOCTOR_EXISTED(1005, "Doctor existed", HttpStatus.BAD_REQUEST),
    DOCTOR_NOT_EXISTED(1006, "Doctor not existed", HttpStatus.NOT_FOUND),
    ROLE_NOT_FOUND(2000, "role not found", HttpStatus.NOT_FOUND),
    PERMISSION_NOT_FOUND(2001, "permission not found", HttpStatus.NOT_FOUND),
    ROLE_EXISTED(2002, "role existed", HttpStatus.BAD_REQUEST),
    PERMISSION_EXISTED(2003, "permission existed", HttpStatus.BAD_REQUEST),
    SPECIALITIES_EXISTED(2004, "specialities existed", HttpStatus.BAD_REQUEST),
    SPECIALITIES_NOT_FOUND(2005, "specialities not found", HttpStatus.NOT_FOUND),
    SCHEDULE_EXISTED(3001, "Work schedule already exists for this date", HttpStatus.BAD_REQUEST),
    SCHEDULE_NOT_FOUND(3002, "Work schedule not found", HttpStatus.NOT_FOUND),
    INVALID_TIME_RANGE(3003, "Start time must be before end time", HttpStatus.BAD_REQUEST),
    UNAUTHENTICATED(5555,"Unauthenticated", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(5050, "You don't have permission", HttpStatus.FORBIDDEN),
    EXISTED_DATA(5055, "Data already exists", HttpStatus.BAD_REQUEST);

    private int code;
    private String message;
    private HttpStatusCode statusCode;
}
