namespace TagSystemAPI.Builders;

public class AccessBuilder
{
    private int _rfid;
    private string _room;
    private string _timeAccess;
    private bool _isAuthorized;

    public AccessBuilder SetRfid(int rfid)
    {
        _rfid = rfid;
        return this;
    }

    public AccessBuilder SetRoom(string room)
    {
        _room = room;
        return this;
    }

    public AccessBuilder SetTimeAccess(string timeAccess)
    {
        _timeAccess = timeAccess;
        return this;
    }

    public AccessBuilder SetIsAuthorized(bool isAuthorized)
    {
        _isAuthorized = isAuthorized;
        return this;
    }

    public Access Build()
    {
        return new Access
        {
            Rfid = _rfid,
            Room = _room,
            TimeAccess = _timeAccess,
            IsAuthorized = _isAuthorized
        };
    }
}

